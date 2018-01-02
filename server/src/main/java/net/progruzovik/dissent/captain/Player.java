package net.progruzovik.dissent.captain;

import org.springframework.web.socket.WebSocketSession;

public interface Player extends Captain {

    Status getStatus();

    void setWebSocketSession(WebSocketSession webSocketSession);

    void addToQueue();

    void removeFromQueue();

    void startScenario();
}
