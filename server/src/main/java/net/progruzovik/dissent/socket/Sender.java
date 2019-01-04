package net.progruzovik.dissent.socket;

import net.progruzovik.dissent.model.message.Message;
import org.springframework.lang.NonNull;
import org.springframework.web.socket.WebSocketSession;

public interface Sender {

    void setSession(@NonNull WebSocketSession session);

    <T> void sendMessage(Message<T> message);
}
