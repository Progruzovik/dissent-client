package net.progruzovik.dissent.model.player;

import net.progruzovik.dissent.rest.deferred.DeferredAction;

public interface Session extends Player {

    Status getStatus();

    void setDeferredAction(DeferredAction deferredAction);
}
