package net.progruzovik.dissent.captain

import net.progruzovik.dissent.model.domain.CaptainStatus
import net.progruzovik.dissent.model.domain.CaptainStatus.*
import net.progruzovik.dissent.model.domain.Ship
import net.progruzovik.dissent.model.domain.battle.Battle
import net.progruzovik.dissent.model.domain.battle.Side
import net.progruzovik.dissent.model.entity.GunEntity
import net.progruzovik.dissent.model.entity.HullEntity
import net.progruzovik.dissent.model.event.EventEmitter
import net.progruzovik.dissent.model.event.EventName
import net.progruzovik.dissent.model.socket.ServerSubject
import net.progruzovik.dissent.repository.GunRepository
import net.progruzovik.dissent.repository.HullRepository
import net.progruzovik.dissent.service.MissionService
import net.progruzovik.dissent.service.PlayerQueueService
import net.progruzovik.dissent.socket.DissentWebSocketOutput
import org.springframework.beans.factory.config.BeanDefinition
import org.springframework.context.annotation.Scope
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Component

@Component
@Scope(BeanDefinition.SCOPE_PROTOTYPE)
class SessionPlayer(
    private val queueService: PlayerQueueService,
    private val missionService: MissionService,
    output: DissentWebSocketOutput,
    hullRepository: HullRepository,
    gunRepository: GunRepository
) : AbstractCaptain(), Player, EventEmitter<ServerSubject> by output {

    override lateinit var id: String

    override val status: CaptainStatus
        get() = when {
            battle?.isRunning == true -> IN_BATTLE
            queueService.isPlayerQueued(this) -> QUEUED
            else -> IDLE
        }

    init {
        val pointerHull: HullEntity = hullRepository.findByIdOrNull(3)!!
        val laser: GunEntity = gunRepository.findByIdOrNull(3)!!
        ships.add(Ship(pointerHull, laser, null))
        ships.add(Ship(hullRepository.findByIdOrNull(7)!!, laser, gunRepository.findByIdOrNull(1)!!))
        ships.add(Ship(pointerHull, laser, null))
    }

    override fun addToBattle(battle: Battle, side: Side) {
        if (status == IN_BATTLE) {
            onBattleFinish()
            emit<Unit>(ServerSubject.BATTLE_FINISH)
        }
        super.addToBattle(battle, side)
        sendCurrentStatus()

        battle.on<Unit>(EventName.BATTLE_FINISH) { onBattleFinish() }
        battle.subscribe { event, data ->
            if (event.isPublicEvent) {
                emit(ServerSubject.valueOf(event.name), data)
            }
        }
    }

    override fun addToQueue() {
        if (status != IDLE) return
        queueService.add(this)
        sendCurrentStatus()
    }

    override fun removeFromQueue() {
        if (status != QUEUED) return
        queueService.remove(this)
        sendCurrentStatus()
    }

    override fun startMission(missionId: Int) {
        if (status != IDLE) return
        missionService.startMission(this, missionId)
    }

    private fun onBattleFinish() {
        for (ship in ships) {
            ship.strength = ship.hull.strength
        }
    }

    private fun sendCurrentStatus() {
        emit(ServerSubject.STATUS, status)
    }
}
