package net.progruzovik.dissent.socket.reader

import net.progruzovik.dissent.model.domain.battle.Battle
import net.progruzovik.dissent.model.domain.battle.field.gun.GunCells
import net.progruzovik.dissent.captain.Player
import net.progruzovik.dissent.model.message.ClientSubject
import net.progruzovik.dissent.model.message.ServerMessage
import net.progruzovik.dissent.model.message.ServerSubject
import org.springframework.stereotype.Component

@Component
class RequestGunCellsReader : Reader {

    override val subject = ClientSubject.REQUEST_GUN_CELLS

    override fun read(player: Player, data: Map<String, Int>) {
        val battle: Battle = player.battle ?: return
        val gunCells: GunCells = battle.getGunCells(data.getValue("gunId"))
        player.sendMessage(ServerMessage(ServerSubject.GUN_CELLS, gunCells))
    }
}
