package net.progruzovik.dissent.model.socket;

import com.fasterxml.jackson.databind.ObjectMapper;
import net.progruzovik.dissent.model.player.Status;
import net.progruzovik.dissent.socket.MessageHandler;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;

public final class WebSocketSessionSender {

    private WebSocketSession session;
    private final ObjectMapper mapper;

    public WebSocketSessionSender(ObjectMapper mapper) {
        this.mapper = mapper;
    }

    public void setSession(WebSocketSession session) {
        this.session = session;
    }

    public void sendStatusMessage(Status status) {
        sendMessage(new Message(MessageHandler.STATUS, String.valueOf(status.ordinal())));
    }

    private void sendMessage(Message message)  {
        if (session != null) {
            try {
                session.sendMessage(new TextMessage(mapper.writeValueAsString(message)));
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}
