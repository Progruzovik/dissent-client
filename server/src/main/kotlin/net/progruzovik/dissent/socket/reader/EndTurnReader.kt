package net.progruzovik.dissent.socket.reader

import net.progruzovik.dissent.captain.Player
import net.progruzovik.dissent.model.message.ClientSubject
import org.springframework.stereotype.Component

@Component
class EndTurnReader : Reader {

    override val subject = ClientSubject.END_TURN

    override fun read(player: Player, data: Map<String, Int>) = player.endTurn()
}
