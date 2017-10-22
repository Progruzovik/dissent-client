package net.progruzovik.dissent.socket;

import com.fasterxml.jackson.databind.ObjectMapper;
import net.progruzovik.dissent.dao.TextureDao;
import net.progruzovik.dissent.model.player.Player;
import net.progruzovik.dissent.model.player.SessionPlayer;
import net.progruzovik.dissent.model.socket.IncomingMessage;
import net.progruzovik.dissent.model.socket.Message;
import net.progruzovik.dissent.model.socket.MessageReader;
import net.progruzovik.dissent.model.util.Cell;
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

    public MessageHandler(ObjectMapper mapper, TextureDao textureDao) {
        this.mapper = mapper;
        readers.put("requestTextures", (p, d) -> p.send(new Message<>("textures", textureDao.getTextures())));

        readers.put("requestStatus", (p, d) -> p.send(new Message<>("status", p.getStatus())));
        readers.put("addToQueue", (p, d) -> p.addToQueue());
        readers.put("removeFromQueue", (p, d) -> p.removeFromQueue());
        readers.put("startScenario", (p, d) -> p.startScenario());

        readers.put("requestReachableCellsAndPaths", (p, d) -> {
            final Map<String, Object> reachableCellsAndPaths = new HashMap<>(2);
            reachableCellsAndPaths.put("reachableCells", p.getBattle().getField().findReachableCellsForActiveUnit());
            reachableCellsAndPaths.put("paths", p.getBattle().getField().getCurrentPaths());
            p.send(new Message<>("reachableCellsAndPaths", reachableCellsAndPaths));
        });
        readers.put("requestShotAndTargetCells", (p, d) ->
            p.send(new Message<>("shotAndTargetCells", p.getBattle().findShotAndTargetCells(d.get("gunId")))));
        readers.put("moveCurrentUnit", (p, d) ->
                p.getBattle().moveCurrentUnit(p.getId(), new Cell(d.get("x"), d.get("y"))));
        readers.put("shootWithCurrentUnit", ((p, d) ->
                p.getBattle().shootWithCurrentUnit(p.getId(), d.get("gunId"), new Cell(d.get("x"), d.get("y")))));
        readers.put("endTurn", (p, d) -> p.getBattle().endTurn(p.getId()));
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        final Player player = (Player) session.getAttributes().get(SessionPlayer.NAME);
        player.setWebSocketSession(session);
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage textMessage) throws IOException {
        final Player player = (Player) session.getAttributes().get(SessionPlayer.NAME);
        final IncomingMessage message = mapper.readValue(textMessage.getPayload(), IncomingMessage.class);
        readers.get(message.getSubject()).read(player, message.getData());
    }
}
