package net.progruzovik.dissent.model.player;

import org.springframework.web.socket.WebSocketSession;

public interface Player extends Captain {

    Status getStatus();

    void setWebSocketSession(WebSocketSession webSocketSession);

    boolean addToQueue();

    boolean removeFromQueue();

    boolean startScenario();

    void sendStatus();

    void sendActions(int fromNumber);
}
