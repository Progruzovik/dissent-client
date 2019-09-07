package net.progruzovik.dissent.socket.reader

import net.progruzovik.dissent.captain.Player
import net.progruzovik.dissent.model.socket.ClientSubject
import org.springframework.stereotype.Component

@Component
class AddToQueueReader : Reader {

    override val subject = ClientSubject.ADD_TO_QUEUE

    override fun read(player: Player, data: Map<String, Int>) = player.addToQueue()
}
