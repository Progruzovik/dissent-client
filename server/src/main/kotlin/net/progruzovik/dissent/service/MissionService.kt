package net.progruzovik.dissent.service

import net.progruzovik.dissent.captain.AiCaptain
import net.progruzovik.dissent.captain.Captain
import org.springframework.beans.factory.ObjectFactory
import org.springframework.stereotype.Service

@Service
class MissionService(private val aiCaptainFactory: ObjectFactory<AiCaptain>, private val battleService: BattleService) {

    fun startMission(captain: Captain, missionId: Int) = battleService.createBattle(captain, aiCaptainFactory.getObject())
}
