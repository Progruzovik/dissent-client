package net.progruzovik.dissent.socket.reader

import net.progruzovik.dissent.battle.model.Battle
import net.progruzovik.dissent.captain.Player
import net.progruzovik.dissent.model.message.ClientSubject
import net.progruzovik.dissent.model.message.ServerMessage
import net.progruzovik.dissent.model.message.ServerSubject
import org.springframework.stereotype.Component

@Component
class RequestPathsAndReachableCellsReader : Reader {

    override val subject = ClientSubject.REQUEST_PATHS_AND_REACHABLE_CELLS

    override fun read(player: Player, data: Map<String, Int>) {
        val battle: Battle = player.battle ?: return
        val pathsAndReachableCells = mapOf<String, Any>(
            "reachableCells" to battle.reachableCells,
            "paths" to battle.paths
        )
        player.sendMessage(ServerMessage<Map<String, Any>>(ServerSubject.PATHS_AND_REACHABLE_CELLS, pathsAndReachableCells))
    }
}
