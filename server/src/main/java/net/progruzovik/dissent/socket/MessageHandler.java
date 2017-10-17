package net.progruzovik.dissent.socket;

import com.fasterxml.jackson.databind.ObjectMapper;
import net.progruzovik.dissent.model.player.Player;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Component
public final class MessageHandler extends TextWebSocketHandler {

    private final ObjectMapper mapper;

    public MessageHandler(ObjectMapper mapper) {
        this.mapper = mapper;
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws IOException {
        final Map<String, String> response = new HashMap<>();
        response.put("playerId", Player.retrieveFromWebSocketSession(session).getId());
        response.put("sessionId", session.getId());
        session.sendMessage(new TextMessage(mapper.writeValueAsString(response)));
    }
}
