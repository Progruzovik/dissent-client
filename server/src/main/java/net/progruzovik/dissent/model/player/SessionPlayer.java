package net.progruzovik.dissent.model.player;

import com.fasterxml.jackson.databind.ObjectMapper;
import net.progruzovik.dissent.battle.Battle;
import net.progruzovik.dissent.battle.PlayerQueue;
import net.progruzovik.dissent.battle.ScenarioDigest;
import net.progruzovik.dissent.dao.GunDao;
import net.progruzovik.dissent.dao.HullDao;
import net.progruzovik.dissent.model.entity.Gun;
import net.progruzovik.dissent.model.entity.Hull;
import net.progruzovik.dissent.model.entity.Ship;
import net.progruzovik.dissent.model.socket.Message;
import net.progruzovik.dissent.model.socket.MessageSender;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketSession;

import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.List;

@Component
@Scope(value = "session", proxyMode = ScopedProxyMode.INTERFACES)
public final class SessionPlayer implements Player {

    public static String NAME = "scopedTarget.sessionPlayer";

    private final String id;
    private final List<Ship> ships = new ArrayList<>();
    private Status status = Status.IDLE;

    private final PlayerQueue queue;
    private final ScenarioDigest scenarioDigest;
    private final MessageSender messageSender;
    private Battle battle;

    public SessionPlayer(HttpSession session, ObjectMapper mapper, PlayerQueue queue,
                         ScenarioDigest scenarioDigest, HullDao shipDao, GunDao gunDao) {
        id = session.getId();
        final Hull basicHull = shipDao.getHull(1);
        final Gun shrapnel = gunDao.getGun(1);
        ships.add(new Ship(1, basicHull, shrapnel, null));
        ships.add(new Ship(1, shipDao.getHull(2), shrapnel, gunDao.getGun(2)));
        ships.add(new Ship(1, basicHull, shrapnel, null));
        this.queue = queue;
        this.scenarioDigest = scenarioDigest;
        messageSender = new MessageSender(mapper);
    }

    @Override
    public String getId() {
        return id;
    }

    @Override
    public List<Ship> getShips() {
        return ships;
    }

    @Override
    public Status getStatus() {
        return status;
    }

    @Override
    public void setStatus(Status status) {
        this.status = status;
        send(new Message<>("status", status));
    }

    @Override
    public Battle getBattle() {
        return battle;
    }

    @Override
    public void setBattle(Battle battle) {
        if (battle != null) {
            if (this.battle != null) {
                send(new Message<>("battleFinish", null));
            }
            this.battle = battle;
            setStatus(Status.IN_BATTLE);
        }
    }

    @Override
    public void setWebSocketSession(WebSocketSession webSocketSession) {
        messageSender.setSession(webSocketSession);
    }

    @Override
    public void addToQueue() {
        queue.add(this);
    }

    @Override
    public void removeFromQueue() {
        queue.remove(this);
    }

    @Override
    public void startScenario() {
        scenarioDigest.start(this);
    }

    @Override
    public void act() { }

    @Override
    public void send(Message message) {
        messageSender.send(message);
    }
}
