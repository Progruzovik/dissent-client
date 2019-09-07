package net.progruzovik.dissent.model.socket;

import org.springframework.lang.NonNull;
import org.springframework.web.reactive.socket.WebSocketSession;

public interface Sender {

    void setUpSession(@NonNull WebSocketSession session);

    <T> void sendMessage(@NonNull ServerMessage<T> message);
}
