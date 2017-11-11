package net.progruzovik.dissent.battle;

import net.progruzovik.dissent.battle.player.Captain;
import net.progruzovik.dissent.battle.player.Status;
import net.progruzovik.dissent.model.battle.Battle;
import org.springframework.stereotype.Service;

@Service
public final class PlayerQueueService implements PlayerQueue {

    private Captain queuedCaptain;

    @Override
    public void add(Captain captain) {
        if (queuedCaptain == null) {
            queuedCaptain = captain;
            captain.setStatus(Status.QUEUED);
        } else if (queuedCaptain != captain) {
            new Battle(queuedCaptain, captain);
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
