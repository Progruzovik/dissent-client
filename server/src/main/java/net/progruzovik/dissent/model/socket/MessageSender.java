package net.progruzovik.dissent.model.socket;

import com.fasterxml.jackson.databind.ObjectMapper;
import net.progruzovik.dissent.model.battle.action.Action;
import net.progruzovik.dissent.model.player.Status;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;

public final class MessageSender {

    private WebSocketSession session;
    private final ObjectMapper mapper;

    public MessageSender(ObjectMapper mapper) {
        this.mapper = mapper;
    }

    public void setSession(WebSocketSession session) {
        this.session = session;
    }

    public void sendStatus(Status status) {
        send(new Message<>(Subject.STATUS, status));
    }

    public void sendAction(Action action) {
        send(new Message<>(Subject.ACTION, action));
    }

    private void send(Message message)  {
        if (session != null) {
            try {
                session.sendMessage(new TextMessage(mapper.writeValueAsString(message)));
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}
