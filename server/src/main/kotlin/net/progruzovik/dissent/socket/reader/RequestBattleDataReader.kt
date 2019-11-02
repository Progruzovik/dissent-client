package net.progruzovik.dissent.socket.reader

import net.progruzovik.dissent.captain.Player
import net.progruzovik.dissent.model.domain.battle.Battle
import net.progruzovik.dissent.model.socket.ClientSubject
import net.progruzovik.dissent.model.socket.ServerSubject
import org.springframework.stereotype.Component

@Component
class RequestBattleDataReader : Reader {

    override val subject = ClientSubject.REQUEST_BATTLE_DATA

    override fun read(player: Player, data: Map<String, Int>) {
        val battle: Battle = player.battle ?: return
        player.emit(ServerSubject.BATTLE_DATA, battle.getBattleData(player.id))
    }
}
