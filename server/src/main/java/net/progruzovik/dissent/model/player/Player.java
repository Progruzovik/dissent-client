package net.progruzovik.dissent.model.player;

import net.progruzovik.dissent.model.battle.action.DeferredAction;
import org.springframework.web.context.request.async.DeferredResult;
import org.springframework.web.socket.WebSocketSession;

import javax.servlet.http.HttpSession;

public interface Player extends Captain {

    String NAME = "player";

    static Player retrieveFromWebSocketSession(WebSocketSession session) {
        return (Player) session.getAttributes().get(NAME);
    }

    Status getStatus();

    void setDeferredStatus(DeferredResult<Status> deferredStatus);

    void setDeferredAction(DeferredAction deferredAction);

    boolean addToQueue();

    boolean removeFromQueue();

    boolean startScenario();
}
