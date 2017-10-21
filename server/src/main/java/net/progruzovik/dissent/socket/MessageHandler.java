package net.progruzovik.dissent.socket;

import com.fasterxml.jackson.databind.ObjectMapper;
import net.progruzovik.dissent.model.player.Player;
import net.progruzovik.dissent.model.player.SessionPlayer;
import net.progruzovik.dissent.model.socket.ClientMessage;
import net.progruzovik.dissent.model.socket.MessageReader;
import net.progruzovik.dissent.model.socket.ServerMessage;
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
    private final Map<String, MessageReader> readers = new HashMap<>(1);

    public MessageHandler(ObjectMapper mapper) {
        this.mapper = mapper;
        readers.put("requestStatus", p -> p.send(new ServerMessage<>("status", p.getStatus())));
        readers.put("addToQueue", Player::addToQueue);
        readers.put("removeFromQueue", Player::removeFromQueue);
        readers.put("startScenario", Player::startScenario);
        readers.put("endTurn", p -> p.getBattle().endTurn(p.getId()));
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        final Player player = (Player) session.getAttributes().get(SessionPlayer.NAME);
        player.setWebSocketSession(session);
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage textMessage) throws IOException {
        final Player player = (Player) session.getAttributes().get(SessionPlayer.NAME);
        final ClientMessage message = mapper.readValue(textMessage.getPayload(), ClientMessage.class);
        readers.get(message.getSubject()).read(player);
    }
}
