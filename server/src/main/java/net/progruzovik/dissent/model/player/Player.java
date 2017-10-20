package net.progruzovik.dissent.model.player;

import org.springframework.web.socket.WebSocketSession;

public interface Player extends Captain {

    void setWebSocketSession(WebSocketSession webSocketSession);

    void addToQueue();

    void removeFromQueue();

    void startScenario();

    void requestStatus();
}
