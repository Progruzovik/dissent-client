package net.progruzovik.dissent.socket;

import com.fasterxml.jackson.databind.ObjectMapper;
import net.progruzovik.dissent.battle.model.field.gun.GunCells;
import net.progruzovik.dissent.battle.model.util.Cell;
import net.progruzovik.dissent.captain.Player;
import net.progruzovik.dissent.captain.SessionPlayer;
import net.progruzovik.dissent.model.message.ClientMessage;
import net.progruzovik.dissent.model.message.ClientSubject;
import net.progruzovik.dissent.model.message.ServerMessage;
import net.progruzovik.dissent.model.message.ServerSubject;
import net.progruzovik.dissent.repository.MissionRepository;
import net.progruzovik.dissent.repository.TextureRepository;
import org.springframework.beans.factory.ObjectFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.socket.WebSocketHandler;
import org.springframework.web.reactive.socket.WebSocketMessage;
import org.springframework.web.reactive.socket.WebSocketSession;
import reactor.core.publisher.Mono;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Component
public final class DissentWebSocketHandler implements WebSocketHandler {

    private final ObjectMapper mapper;
    private final ObjectFactory<SessionPlayer> sessionPlayerFactory;
    private final Map<ClientSubject, Reader> readers = new HashMap<>();

    public DissentWebSocketHandler(ObjectMapper mapper, ObjectFactory<SessionPlayer> sessionPlayerFactory,
                                   TextureRepository textureRepository, MissionRepository missionRepository) {
        this.mapper = mapper;
        this.sessionPlayerFactory = sessionPlayerFactory;

        readers.put(ClientSubject.REQUEST_TEXTURES, (p, d) ->
                p.sendMessage(new ServerMessage<>(ServerSubject.TEXTURES, textureRepository.findAll())));

        readers.put(ClientSubject.REQUEST_STATUS, (p, d) ->
                p.sendMessage(new ServerMessage<>(ServerSubject.STATUS, p.getStatus())));
        readers.put(ClientSubject.REQUEST_SHIPS, (p, d) ->
                p.sendMessage(new ServerMessage<>(ServerSubject.SHIPS, p.getShips())));
        readers.put(ClientSubject.REQUEST_MISSIONS, (p, d) ->
                p.sendMessage(new ServerMessage<>(ServerSubject.MISSIONS, missionRepository.findAll())));
        readers.put(ClientSubject.ADD_TO_QUEUE, (p, d) -> p.addToQueue());
        readers.put(ClientSubject.REMOVE_FROM_QUEUE, (p, d) -> p.removeFromQueue());
        readers.put(ClientSubject.START_MISSION, (p, d) -> p.startMission(d.get("missionId")));

        readers.put(ClientSubject.REQUEST_BATTLE_DATA, (p, d) -> {
            if (p.getBattle() != null) {
                p.sendMessage(new ServerMessage<>(ServerSubject.BATTLE_DATA, p.getBattle().getBattleData(p.getId())));
            }
        });
        readers.put(ClientSubject.REQUEST_PATHS_AND_REACHABLE_CELLS, (p, d) -> {
            if (p.getBattle() != null) {
                final Map<String, Object> pathsAndReachableCells = new HashMap<>(2);
                pathsAndReachableCells.put("reachableCells", p.getBattle().getReachableCells());
                pathsAndReachableCells.put("paths", p.getBattle().getPaths());
                p.sendMessage(new ServerMessage<>(ServerSubject.PATHS_AND_REACHABLE_CELLS, pathsAndReachableCells));
            }
        });
        readers.put(ClientSubject.MOVE_CURRENT_UNIT, (p, d) -> {
            if (p.getBattle() != null) {
                p.getBattle().moveCurrentUnit(p.getId(), new Cell(d.get("x"), d.get("y")));
            }
        });
        readers.put(ClientSubject.REQUEST_GUN_CELLS, (p, d) -> {
            if (p.getBattle() != null) {
                final GunCells gunCells = p.getBattle().getGunCells(d.get("gunId"));
                p.sendMessage(new ServerMessage<>(ServerSubject.GUN_CELLS, gunCells));
            }
        });
        readers.put(ClientSubject.SHOOT_WITH_CURRENT_UNIT, ((p, d) -> {
            if (p.getBattle() != null) {
                p.getBattle().shootWithCurrentUnit(p.getId(), d.get("gunId"), new Cell(d.get("x"), d.get("y")));
            }
        }));
        readers.put(ClientSubject.END_TURN, (p, d) -> {
            if (p.getBattle() != null) {
                p.getBattle().endTurn(p.getId());
            }
        });
    }

    @Override
    public Mono<Void> handle(WebSocketSession session) {
        final Player player = sessionPlayerFactory.getObject();
        session.getAttributes().put("player", player);
        player.setSession(session);
        return session.receive().map(WebSocketMessage::getPayloadAsText).map(m -> {
            ClientMessage message = null;
            try {
                message = mapper.readValue(m, ClientMessage.class);
            } catch (IOException e) {
                //TODO: log and throw runtime exception
                e.printStackTrace();
            }
            readers.get(message.getSubject()).read(player, message.getData());
            return m;
        }).then();
    }
}
