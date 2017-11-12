package net.progruzovik.dissent.battle;

import net.progruzovik.dissent.battle.captain.Player;
import org.springframework.stereotype.Service;

@Service
public final class PlayerQueueService implements PlayerQueue {

    private Player queuedPlayer;
    private final BattleFactory battleFactory;

    public PlayerQueueService(BattleFactory battleFactory) {
        this.battleFactory = battleFactory;
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
            battleFactory.createBattle(queuedPlayer, player);
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
