package net.progruzovik.dissent.battle;

import net.progruzovik.dissent.model.player.Player;
import net.progruzovik.dissent.model.player.Status;
import org.springframework.stereotype.Service;

@Service
public final class PlayerQueueService implements PlayerQueue {

    private Player queuedPlayer;
    private final BattleFactory battleFactory;

    public PlayerQueueService(BattleFactory battleFactory) {
        this.battleFactory = battleFactory;
    }

    @Override
    public boolean add(Player player) {
        if (queuedPlayer == player) return false;

        if (queuedPlayer == null) {
            queuedPlayer = player;
            player.setStatus(Status.QUEUED);
        } else {
            battleFactory.create(queuedPlayer, player);
            queuedPlayer = null;
        }
        return true;
    }

    @Override
    public boolean remove(Player player) {
        if (queuedPlayer != player) return false;

        queuedPlayer = null;
        player.setStatus(Status.IDLE);
        return true;
    }
}
