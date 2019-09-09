package net.progruzovik.dissent.socket.reader

import net.progruzovik.dissent.captain.Player
import net.progruzovik.dissent.model.socket.ClientSubject
import net.progruzovik.dissent.model.socket.ServerSubject
import net.progruzovik.dissent.repository.MissionRepository
import org.springframework.stereotype.Component

@Component
class RequestMissionsReader(private val missionRepository: MissionRepository) : Reader {

    override val subject = ClientSubject.REQUEST_MISSIONS

    override fun read(player: Player, data: Map<String, Int>) {
        player.sendMessage(ServerSubject.MISSIONS, missionRepository.findAll())
    }
}
