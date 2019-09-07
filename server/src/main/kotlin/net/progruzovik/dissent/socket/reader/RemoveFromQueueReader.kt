package net.progruzovik.dissent.socket.reader

import net.progruzovik.dissent.captain.Player
import net.progruzovik.dissent.model.socket.ClientSubject
import org.springframework.stereotype.Component

@Component
class RemoveFromQueueReader : Reader {

    override val subject = ClientSubject.REMOVE_FROM_QUEUE

    override fun read(player: Player, data: Map<String, Int>) = player.removeFromQueue()
}
