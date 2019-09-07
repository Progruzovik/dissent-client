package net.progruzovik.dissent.captain

import net.progruzovik.dissent.model.domain.CaptainStatus
import net.progruzovik.dissent.model.socket.Sender

interface Player : Captain, Sender {

    val status: CaptainStatus

    fun addToQueue()

    fun removeFromQueue()

    fun startMission(missionId: Int)
}
