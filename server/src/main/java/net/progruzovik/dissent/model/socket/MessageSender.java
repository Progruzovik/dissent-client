package net.progruzovik.dissent.model.socket;

import com.fasterxml.jackson.databind.ObjectMapper;
import net.progruzovik.dissent.model.battle.action.Action;
import net.progruzovik.dissent.model.player.Status;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;

public final class MessageSender {

    private final static Logger log = LoggerFactory.getLogger(MessageSender.class);

    private WebSocketSession session;
    private final ObjectMapper mapper;

    public MessageSender(ObjectMapper mapper) {
        this.mapper = mapper;
    }

    public void setSession(WebSocketSession session) {
        this.session = session;
    }

    public void sendStatus(Status status) {
        send(new ServerMessage<>("status", status));
    }

    public void sendAction(Action action) {
        send(new ServerMessage<>("action", action));
    }

    private void send(ServerMessage message)  {
        if (session != null) {
            try {
                session.sendMessage(new TextMessage(mapper.writeValueAsString(message)));
            } catch (IOException e) {
                log.error("Can't send message with subject \"{}\"!", message.getSubject(), e);
            }
        }
    }
}
