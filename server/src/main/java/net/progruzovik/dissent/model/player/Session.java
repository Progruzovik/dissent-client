package net.progruzovik.dissent.model.player;

import net.progruzovik.dissent.model.battle.action.DeferredAction;
import org.springframework.web.context.request.async.DeferredResult;

public interface Session extends Player {

    Status getStatus();

    void setDeferredStatus(DeferredResult<Status> deferredStatus);

    void setDeferredAction(DeferredAction deferredAction);

    boolean addToQueue();

    boolean removeFromQueue();
}
