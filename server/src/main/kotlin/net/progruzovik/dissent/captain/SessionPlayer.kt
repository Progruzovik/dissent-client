package net.progruzovik.dissent.captain

import net.progruzovik.dissent.mapper.MessageMapper
import net.progruzovik.dissent.model.domain.CaptainStatus
import net.progruzovik.dissent.model.domain.Ship
import net.progruzovik.dissent.model.domain.battle.Battle
import net.progruzovik.dissent.model.domain.battle.Side
import net.progruzovik.dissent.model.entity.GunEntity
import net.progruzovik.dissent.model.entity.HullEntity
import net.progruzovik.dissent.model.event.Event
import net.progruzovik.dissent.model.event.EventSubject
import net.progruzovik.dissent.model.socket.ServerMessage
import net.progruzovik.dissent.model.socket.ServerSubject
import net.progruzovik.dissent.repository.GunRepository
import net.progruzovik.dissent.repository.HullRepository
import net.progruzovik.dissent.service.MissionDigest
import net.progruzovik.dissent.service.PlayerQueue
import net.progruzovik.dissent.socket.DissentWebSocketSender
import org.springframework.beans.factory.config.BeanDefinition
import org.springframework.context.annotation.Scope
import org.springframework.stereotype.Component
import org.springframework.web.reactive.socket.WebSocketSession

@Component
@Scope(BeanDefinition.SCOPE_PROTOTYPE)
class SessionPlayer(
    private val queue: PlayerQueue,
    private val missionDigest: MissionDigest,
    private val sender: DissentWebSocketSender,
    private val messageMapper: MessageMapper,
    hullRepository: HullRepository,
    gunRepository: GunRepository
) : AbstractCaptain(), Player {

    override lateinit var id: String

    override val status: CaptainStatus
        get() {
            if (battle?.isRunning == true) return CaptainStatus.IN_BATTLE
            if (queue.isQueued(this)) return CaptainStatus.QUEUED
            return CaptainStatus.IDLE
        }

    init {
        val pointerHull: HullEntity = hullRepository.findById(3).get()
        val laser: GunEntity = gunRepository.findById(3).get()
        ships.add(Ship(pointerHull, laser, null))
        ships.add(Ship(hullRepository.findById(7).get(), laser, gunRepository.findById(1).get()))
        ships.add(Ship(pointerHull, laser, null))
    }

    override fun setUpSession(session: WebSocketSession) {
        id = session.id
        sender.setUpSession(session)
    }

    override fun accept(event: Event<*>) {
        if (event.subject == EventSubject.BATTLE_FINISH) {
            onBattleFinish()
        }
        if (event.subject.isPublic) {
            sendMessage(messageMapper.apply(event))
        }
    }

    override fun addToBattle(battle: Battle, side: Side) {
        if (status == CaptainStatus.IN_BATTLE) {
            onBattleFinish()
            sendMessage(ServerMessage<Any>(ServerSubject.BATTLE_FINISH))
        }
        super.addToBattle(battle, side)
        sendCurrentStatus()
    }

    override fun addToQueue() {
        if (status != CaptainStatus.IDLE) return
        queue.add(this)
        sendCurrentStatus()
    }

    override fun removeFromQueue() {
        if (status != CaptainStatus.QUEUED) return
        queue.remove(this)
        sendCurrentStatus()
    }

    override fun startMission(missionId: Int) {
        if (status != CaptainStatus.IDLE) return
        missionDigest.startMission(this, missionId)
    }

    override fun <T> sendMessage(message: ServerMessage<T>) = sender.sendMessage(message)

    private fun onBattleFinish() {
        for (ship in ships) {
            ship.strength = ship.hull.strength
        }
    }

    private fun sendCurrentStatus() {
        sendMessage(ServerMessage(ServerSubject.STATUS, status))
    }
}
