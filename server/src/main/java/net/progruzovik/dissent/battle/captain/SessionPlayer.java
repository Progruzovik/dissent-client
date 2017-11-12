package net.progruzovik.dissent.battle.captain;

import com.fasterxml.jackson.databind.ObjectMapper;
import net.progruzovik.dissent.battle.PlayerQueue;
import net.progruzovik.dissent.battle.ScenarioDigest;
import net.progruzovik.dissent.dao.GunDao;
import net.progruzovik.dissent.dao.HullDao;
import net.progruzovik.dissent.model.battle.Battle;
import net.progruzovik.dissent.model.battle.Side;
import net.progruzovik.dissent.model.battle.Unit;
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

@Component
@Scope(value = "session", proxyMode = ScopedProxyMode.INTERFACES)
public final class SessionPlayer extends AbstractCaptain implements Player {

    public static String NAME = "scopedTarget.sessionPlayer";

    private final String id;
    private Status status = Status.IDLE;

    private final PlayerQueue queue;
    private final ScenarioDigest scenarioDigest;
    private final MessageSender messageSender;

    public SessionPlayer(HttpSession session, ObjectMapper mapper, PlayerQueue queue,
                         ScenarioDigest scenarioDigest, HullDao shipDao, GunDao gunDao) {
        id = session.getId();
        final Hull basicHull = shipDao.getHull(1);
        final Gun shrapnel = gunDao.getGun(1);
        getShips().add(new Ship(basicHull, shrapnel, null));
        getShips().add(new Ship(shipDao.getHull(2), shrapnel, gunDao.getGun(2)));
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
        return status;
    }

    @Override
    public void setStatus(Status status) {
        this.status = status;
        sendMessage(new Message<>("status", status));
    }

    @Override
    public void registerBattle(Side side, Battle battle) {
        if (getBattle() != null) {
            sendMessage(new Message<>("battleFinish", null));
        }
        super.registerBattle(side, battle);
        if (battle != null) {
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
    public void act(Unit unit) { }

    @Override
    public void sendMessage(Message message) {
        messageSender.send(message);
    }
}
