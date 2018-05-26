package net.progruzovik.dissent.socket.model;

import com.fasterxml.jackson.databind.ObjectMapper;
import net.progruzovik.dissent.model.Message;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;

public final class MessageSender {

    private final static Logger log = LoggerFactory.getLogger(MessageSender.class);

    private @Nullable WebSocketSession session;
    private final @NonNull ObjectMapper mapper;

    public MessageSender(@NonNull ObjectMapper mapper) {
        this.mapper = mapper;
    }

    public void setSession(@NonNull WebSocketSession session) {
        this.session = session;
    }

    public <T> void send(Message<T> message)  {
        if (session != null) {
            try {
                session.sendMessage(new TextMessage(mapper.writeValueAsString(message)));
            } catch (IOException e) {
                session = null;
                log.error("Can't send message with subject \"{}\"!", message.getSubject(), e);
            }
        }
    }
}
