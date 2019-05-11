package net.progruzovik.dissent.socket;

import com.fasterxml.jackson.databind.ObjectMapper;
import net.progruzovik.dissent.model.message.Sender;
import net.progruzovik.dissent.model.message.ServerMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.socket.WebSocketSession;
import reactor.core.publisher.Mono;

import java.io.IOException;

@Component
@Scope(value = ConfigurableBeanFactory.SCOPE_PROTOTYPE)
public final class WebSocketSender implements Sender {

    private static final Logger log = LoggerFactory.getLogger(WebSocketSender.class);

    private @Nullable WebSocketSession session;
    private final ObjectMapper mapper;

    public WebSocketSender(ObjectMapper mapper) {
        this.mapper = mapper;
    }

    @Override
    public void setSession(@NonNull WebSocketSession session) {
        this.session = session;
    }

    @Override
    public <T> void sendMessage(@NonNull ServerMessage<T> message)  {
        if (session == null) return;
        try {
            session.send(Mono.just(session.textMessage(mapper.writeValueAsString(message))))
                    .subscribe();
        } catch (IOException e) {
            session = null;
            log.error("Can't send message with subject \"{}\"!", message.getSubject(), e);
        }
    }
}
