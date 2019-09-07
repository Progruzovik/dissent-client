package net.progruzovik.dissent.service

import net.progruzovik.dissent.captain.Player
import org.springframework.stereotype.Service

@Service
class PlayerQueueService(private val battleService: BattleService) {

    @Volatile private var queuedPlayer: Player? = null

    fun isPlayerQueued(player: Player): Boolean = queuedPlayer === player

    @Synchronized fun add(player: Player) {
        val queuedPlayer: Player? = this.queuedPlayer
        if (queuedPlayer == null) {
            this.queuedPlayer = player
        } else if (queuedPlayer !== player) {
            battleService.createBattle(queuedPlayer, player)
            this.queuedPlayer = null
        }
    }

    @Synchronized fun remove(player: Player) {
        if (queuedPlayer === player) {
            queuedPlayer = null
        }
    }
}
