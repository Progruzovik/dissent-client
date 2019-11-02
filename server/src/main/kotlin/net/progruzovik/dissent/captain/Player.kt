package net.progruzovik.dissent.captain

import net.progruzovik.dissent.model.domain.CaptainStatus
import net.progruzovik.dissent.model.event.EventEmitter
import net.progruzovik.dissent.model.socket.ServerSubject

interface Player : Captain, EventEmitter<ServerSubject> {

    val status: CaptainStatus

    fun addToQueue()

    fun removeFromQueue()

    fun startMission(missionId: Int)
}
