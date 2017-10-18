package net.progruzovik.dissent.model.player;

import net.progruzovik.dissent.model.battle.action.DeferredAction;
import net.progruzovik.dissent.model.socket.WebSocketSessionSender;

public interface Player extends Captain {

    String NAME = "player";

    Status getStatus();

    WebSocketSessionSender getWebSocketSessionSender();

    void setDeferredAction(DeferredAction deferredAction);

    boolean addToQueue();

    boolean removeFromQueue();

    boolean startScenario();
}
