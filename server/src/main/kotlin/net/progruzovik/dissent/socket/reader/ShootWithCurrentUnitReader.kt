package net.progruzovik.dissent.socket.reader

import net.progruzovik.dissent.model.domain.util.Cell
import net.progruzovik.dissent.captain.Player
import net.progruzovik.dissent.model.message.ClientSubject
import org.springframework.stereotype.Component

@Component
class ShootWithCurrentUnitReader : Reader {

    override val subject = ClientSubject.SHOOT_WITH_CURRENT_UNIT

    override fun read(player: Player, data: Map<String, Int>) {
        player.battle?.shootWithCurrentUnit(player.id, data.getValue("gunId"), Cell(data.getValue("x"), data.getValue("y")))
    }
}
