package net.progruzovik.dissent.battle;

import net.progruzovik.dissent.battle.captain.Captain;
import net.progruzovik.dissent.battle.captain.Status;
import org.springframework.stereotype.Service;

@Service
public final class PlayerQueueService implements PlayerQueue {

    private Captain queuedCaptain;
    private final BattleFactory battleFactory;

    public PlayerQueueService(BattleFactory battleFactory) {
        this.battleFactory = battleFactory;
    }

    @Override
    public void add(Captain captain) {
        if (queuedCaptain == null) {
            queuedCaptain = captain;
            captain.setStatus(Status.QUEUED);
        } else if (queuedCaptain != captain) {
            battleFactory.createBattle(queuedCaptain, captain);
            queuedCaptain = null;
        }
    }

    @Override
    public void remove(Captain captain) {
        if (queuedCaptain == captain) {
            queuedCaptain = null;
            captain.setStatus(Status.IDLE);
        }
    }
}
