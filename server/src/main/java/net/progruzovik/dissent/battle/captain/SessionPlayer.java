package net.progruzovik.dissent.battle.captain;

import com.fasterxml.jackson.databind.ObjectMapper;
import net.progruzovik.dissent.battle.PlayerQueue;
import net.progruzovik.dissent.battle.ScenarioDigest;
import net.progruzovik.dissent.dao.GunDao;
import net.progruzovik.dissent.dao.HullDao;
import net.progruzovik.dissent.battle.model.Battle;
import net.progruzovik.dissent.battle.model.Side;
import net.progruzovik.dissent.battle.model.Unit;
import net.progruzovik.dissent.model.entity.Gun;
import net.progruzovik.dissent.model.entity.Hull;
import net.progruzovik.dissent.model.entity.Ship;
import net.progruzovik.dissent.socket.model.Message;
import net.progruzovik.dissent.socket.model.MessageSender;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketSession;

import javax.servlet.http.HttpSession;

@Component
@Scope(value = "session", proxyMode = ScopedProxyMode.INTERFACES)
public final class SessionPlayer extends AbstractCaptain implements Player {

    public static String NAME = "scopedTarget.sessionPlayer";

    private final String id;

    private final PlayerQueue queue;
    private final ScenarioDigest scenarioDigest;
    private final MessageSender messageSender;

    public SessionPlayer(HttpSession session, ObjectMapper mapper, PlayerQueue queue,
                         ScenarioDigest scenarioDigest, HullDao shipDao, GunDao gunDao) {
        id = session.getId();
        final Hull basicHull = shipDao.getHull(1);
        final Gun shrapnel = gunDao.getGun(1);
        getShips().add(new Ship(basicHull, shrapnel, null));
        getShips().add(new Ship(shipDao.getHull(2), shrapnel, gunDao.getGun(3)));
        getShips().add(new Ship(basicHull, shrapnel, null));
        this.queue = queue;
        this.scenarioDigest = scenarioDigest;
        messageSender = new MessageSender(mapper);
    }

    @Override
    public String getId() {
        return id;
    }

    @Override
    public Status getStatus() {
        if (getBattle() != null && getBattle().isRunning()) return Status.IN_BATTLE;
        if (queue.isQueued(this)) return Status.QUEUED;
        return Status.IDLE;
    }

    @Override
    public void addToBattle(Side side, Battle battle) {
        if (getStatus() == Status.IN_BATTLE) {
            sendMessage(new Message("battleFinish"));
        }
        for (final Ship ship : getShips()) {
            ship.setStrength(ship.getHull().getStrength());
        }
        super.addToBattle(side, battle);
        sendCurrentStatus();
    }

    @Override
    public void setWebSocketSession(WebSocketSession webSocketSession) {
        messageSender.setSession(webSocketSession);
    }

    @Override
    public void addToQueue() {
        queue.add(this);
        sendCurrentStatus();
    }

    @Override
    public void removeFromQueue() {
        queue.remove(this);
        sendCurrentStatus();
    }

    @Override
    public void startScenario() {
        scenarioDigest.start(this);
    }

    @Override
    public void act(Unit unit) { }

    @Override
    public void sendMessage(Message message) {
        messageSender.send(message);
    }

    private void sendCurrentStatus() {
        sendMessage(new Message<>("status", getStatus()));
    }
}
