package net.progruzovik.dissent.model.player;

import com.fasterxml.jackson.databind.ObjectMapper;
import net.progruzovik.dissent.battle.Battle;
import net.progruzovik.dissent.battle.PlayerQueue;
import net.progruzovik.dissent.battle.ScenarioDigest;
import net.progruzovik.dissent.dao.GunDao;
import net.progruzovik.dissent.dao.HullDao;
import net.progruzovik.dissent.model.battle.action.Action;
import net.progruzovik.dissent.model.battle.action.ActionType;
import net.progruzovik.dissent.model.entity.Gun;
import net.progruzovik.dissent.model.entity.Hull;
import net.progruzovik.dissent.model.entity.Ship;
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
        ships.add(new Ship(basicHull, shrapnel, null));
        ships.add(new Ship(shipDao.getHull(2), shrapnel, gunDao.getGun(2)));
        ships.add(new Ship(basicHull, shrapnel, null));
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
        messageSender.sendStatus(status);
    }

    @Override
    public Battle getBattle() {
        return battle;
    }

    @Override
    public void setBattle(Battle battle) {
        if (battle != null) {
            if (this.battle != null) {
                messageSender.sendAction(new Action(ActionType.FINISH));
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
    public boolean addToQueue() {
        if (status == Status.QUEUED) return false;
        queue.add(this);
        return true;
    }

    @Override
    public boolean removeFromQueue() {
        if (status != Status.QUEUED) return false;
        queue.remove(this);
        return true;
    }

    @Override
    public boolean startScenario() {
        if (status == Status.QUEUED) return false;
        scenarioDigest.start(this);
        return true;
    }

    @Override
    public void newAction(Action action) {
        messageSender.sendAction(action);
    }

    @Override
    public void sendStatus() {
        messageSender.sendStatus(status);
    }

    @Override
    public void sendActions(int fromNumber) {
        for (final Action action : battle.getActions(fromNumber)) {
            messageSender.sendAction(action);
        }
    }

    @Override
    public void act() { }
}
