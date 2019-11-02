package net.progruzovik.dissent.socket.reader

import net.progruzovik.dissent.captain.Player
import net.progruzovik.dissent.model.socket.ClientSubject
import net.progruzovik.dissent.model.socket.ServerSubject
import org.springframework.stereotype.Component

@Component
class RequestStatusReader : Reader {

    override val subject = ClientSubject.REQUEST_STATUS

    override fun read(player: Player, data: Map<String, Int>) {
        player.emit(ServerSubject.STATUS, player.status)
    }
}
