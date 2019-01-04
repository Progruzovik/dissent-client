package net.progruzovik.dissent.service;

import net.progruzovik.dissent.battle.BattleCreator;
import net.progruzovik.dissent.captain.Player;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

@Service
public final class PlayerQueueService implements PlayerQueue {

    private Player queuedPlayer;
    private final BattleCreator battleCreator;

    public PlayerQueueService(BattleCreator battleCreator) {
        this.battleCreator = battleCreator;
    }

    @Override
    public boolean isQueued(@NonNull Player player) {
        return queuedPlayer == player;
    }

    @Override
    public synchronized void add(@NonNull Player player) {
        if (queuedPlayer == null) {
            queuedPlayer = player;
        } else if (queuedPlayer != player) {
            battleCreator.createBattle(queuedPlayer, player);
            queuedPlayer = null;
        }
    }

    @Override
    public synchronized void remove(@NonNull Player player) {
        if (queuedPlayer == player) {
            queuedPlayer = null;
        }
    }
}
