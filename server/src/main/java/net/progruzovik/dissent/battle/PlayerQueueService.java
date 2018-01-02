package net.progruzovik.dissent.battle;

import net.progruzovik.dissent.captain.Player;
import org.springframework.stereotype.Service;

@Service
public final class PlayerQueueService implements PlayerQueue {

    private Player queuedPlayer;
    private final BattleCreator battleCreator;

    public PlayerQueueService(BattleCreator battleCreator) {
        this.battleCreator = battleCreator;
    }

    @Override
    public boolean isQueued(Player player) {
        return queuedPlayer == player;
    }

    @Override
    public void add(Player player) {
        if (queuedPlayer == null) {
            queuedPlayer = player;
        } else if (queuedPlayer != player) {
            battleCreator.createBattle(queuedPlayer, player);
            queuedPlayer = null;
        }
    }

    @Override
    public void remove(Player player) {
        if (queuedPlayer == player) {
            queuedPlayer = null;
        }
    }
}
