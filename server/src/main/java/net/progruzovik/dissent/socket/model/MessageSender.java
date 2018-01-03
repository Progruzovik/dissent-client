package net.progruzovik.dissent.socket.model;

import com.fasterxml.jackson.databind.ObjectMapper;
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

    public <T> void send(Message<T> message)  {
        if (session != null) {
            try {
                session.sendMessage(new TextMessage(mapper.writeValueAsString(message)));
            } catch (IOException e) {
                log.error("Can't send message with subject \"{}\"!", message.getSubject(), e);
            }
        }
    }
}
