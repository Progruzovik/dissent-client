package net.progruzovik.dissent.socket.reader

import net.progruzovik.dissent.captain.Player
import net.progruzovik.dissent.model.socket.ClientSubject
import org.springframework.stereotype.Component

@Component
class StartMissionReader : Reader {

    override val subject = ClientSubject.START_MISSION

    override fun read(player: Player, data: Map<String, Int>) = player.startMission(data.getValue("missionId"))
}
