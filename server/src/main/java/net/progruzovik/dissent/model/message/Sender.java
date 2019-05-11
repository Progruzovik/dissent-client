package net.progruzovik.dissent.model.message;

import org.springframework.lang.NonNull;
import org.springframework.web.reactive.socket.WebSocketSession;

public interface Sender {

    void setSession(@NonNull WebSocketSession session);

    <T> void sendMessage(@NonNull ServerMessage<T> message);
}
