package net.progruzovik.dissent.socket;

import com.fasterxml.jackson.databind.ObjectMapper;
import net.progruzovik.dissent.model.player.Player;
import net.progruzovik.dissent.model.socket.Message;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;

@Component
public final class MessageHandler extends TextWebSocketHandler {

    public static String STATUS = "status";

    private final ObjectMapper mapper;

    public MessageHandler(ObjectMapper mapper) {
        this.mapper = mapper;
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        final Player player = (Player) session.getAttributes().get(Player.NAME);
        player.getWebSocketSessionSender().setSession(session);
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage textMessage) throws IOException {
        final Player player = (Player) session.getAttributes().get(Player.NAME);
        final Message requestMessage = mapper.readValue(textMessage.getPayload(), Message.class);
        if (requestMessage.getTitle().equals(STATUS)) {
            final Message responseMessage = new Message(STATUS, player.getStatus().toString());
            session.sendMessage(new TextMessage(mapper.writeValueAsString(responseMessage)));
        }
    }
}
