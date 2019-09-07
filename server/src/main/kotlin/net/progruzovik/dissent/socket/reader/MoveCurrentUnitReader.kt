package net.progruzovik.dissent.socket.reader

import net.progruzovik.dissent.model.domain.util.Cell
import net.progruzovik.dissent.captain.Player
import net.progruzovik.dissent.model.socket.ClientSubject
import org.springframework.stereotype.Component

@Component
class MoveCurrentUnitReader : Reader {

    override val subject = ClientSubject.MOVE_CURRENT_UNIT

    override fun read(player: Player, data: Map<String, Int>) {
        player.battle?.moveCurrentUnit(player.id, Cell(data.getValue("x"), data.getValue("y")))
    }
}
