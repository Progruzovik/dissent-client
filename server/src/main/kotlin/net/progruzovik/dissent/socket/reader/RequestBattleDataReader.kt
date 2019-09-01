package net.progruzovik.dissent.socket.reader

import net.progruzovik.dissent.battle.model.Battle
import net.progruzovik.dissent.captain.Player
import net.progruzovik.dissent.model.message.ClientSubject
import net.progruzovik.dissent.model.message.ServerMessage
import net.progruzovik.dissent.model.message.ServerSubject
import org.springframework.stereotype.Component

@Component
class RequestBattleDataReader : Reader {

    override val subject = ClientSubject.REQUEST_BATTLE_DATA

    override fun read(player: Player, data: Map<String, Int>) {
        val battle: Battle = player.battle ?: return
        player.sendMessage(ServerMessage(ServerSubject.BATTLE_DATA, battle.getBattleData(player.id)))
    }
}
