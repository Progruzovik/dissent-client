package net.progruzovik.dissent.socket;

import com.fasterxml.jackson.databind.ObjectMapper;
import net.progruzovik.dissent.battle.model.field.gun.GunCells;
import net.progruzovik.dissent.battle.model.util.Cell;
import net.progruzovik.dissent.captain.Player;
import net.progruzovik.dissent.dao.MissionDao;
import net.progruzovik.dissent.dao.TextureDao;
import net.progruzovik.dissent.model.Message;
import net.progruzovik.dissent.socket.model.IncomingMessage;
import net.progruzovik.dissent.socket.model.Reader;
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
    private final Map<String, Reader> readers = new HashMap<>();

    public MessageHandler(ObjectMapper mapper, TextureDao textureDao, MissionDao missionDao) {
        this.mapper = mapper;
        readers.put("requestTextures", (p, d) -> p.sendMessage(new Message<>("textures", textureDao.getTextures())));

        readers.put("requestStatus", (p, d) -> p.sendMessage(new Message<>("status", p.getStatus())));
        readers.put("requestShips", (p, d) -> p.sendMessage(new Message<>("ships", p.getShips())));
        readers.put("requestMissions", (p, d) -> p.sendMessage(new Message<>("missions", missionDao.getMissions())));
        readers.put("addToQueue", (p, d) -> p.addToQueue());
        readers.put("removeFromQueue", (p, d) -> p.removeFromQueue());
        readers.put("startMission", (p, d) -> p.startMission(d.get("missionId")));

        readers.put("requestBattleData", (p, d) ->
                p.sendMessage(new Message<>("battleData", p.getBattle().getBattleData(p.getId()))));
        readers.put("requestPathsAndReachableCells", (p, d) -> {
            final Map<String, Object> pathsAndReachableCells = new HashMap<>(2);
            pathsAndReachableCells.put("reachableCells", p.getBattle().getReachableCells());
            pathsAndReachableCells.put("paths", p.getBattle().getPaths());
            p.sendMessage(new Message<>("pathsAndReachableCells", pathsAndReachableCells));
        });
        readers.put("moveCurrentUnit", (p, d) ->
                p.getBattle().moveCurrentUnit(p.getId(), new Cell(d.get("x"), d.get("y"))));
        readers.put("requestGunCells", (p, d) -> {
            final GunCells gunCells = p.getBattle().getGunCells(d.get("gunId"));
            p.sendMessage(new Message<>("gunCells", gunCells));
        });
        readers.put("shootWithCurrentUnit", ((p, d) ->
                p.getBattle().shootWithCurrentUnit(p.getId(), d.get("gunId"), new Cell(d.get("x"), d.get("y")))));
        readers.put("endTurn", (p, d) -> p.getBattle().endTurn(p.getId()));
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        final Player player = (Player) session.getAttributes().get("player");
        player.setSession(session);
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage textMessage) throws IOException {
        final Player player = (Player) session.getAttributes().get("player");
        final IncomingMessage message = mapper.readValue(textMessage.getPayload(), IncomingMessage.class);
        readers.get(message.getSubject()).read(player, message.getData());
    }
}
