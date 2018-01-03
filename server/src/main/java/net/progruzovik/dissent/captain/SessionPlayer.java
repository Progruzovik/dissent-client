package net.progruzovik.dissent.captain;

import com.fasterxml.jackson.databind.ObjectMapper;
import net.progruzovik.dissent.battle.PlayerQueue;
import net.progruzovik.dissent.battle.ScenarioDigest;
import net.progruzovik.dissent.battle.model.Battle;
import net.progruzovik.dissent.battle.model.Side;
import net.progruzovik.dissent.dao.GunDao;
import net.progruzovik.dissent.dao.HullDao;
import net.progruzovik.dissent.model.Message;
import net.progruzovik.dissent.model.entity.Gun;
import net.progruzovik.dissent.model.entity.Hull;
import net.progruzovik.dissent.model.entity.Ship;
import net.progruzovik.dissent.socket.model.MessageSender;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpSession;
import java.util.Observable;

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
    public MessageSender getMessageSender() {
        return messageSender;
    }

    @Override
    public void update(Observable battle, Object data) {
        final Message<?> message = (Message<?>) data;
        if (!message.getSubject().equals(Battle.TIME_TO_ACT)) {
            messageSender.send((Message<?>) data);
        }
    }

    @Override
    public void addToBattle(Side side, Battle battle) {
        if (getStatus() == Status.IN_BATTLE) {
            messageSender.send(new Message<>("battleFinish"));
        }
        for (final Ship ship : getShips()) {
            ship.setStrength(ship.getHull().getStrength());
        }
        super.addToBattle(side, battle);
        sendCurrentStatus();
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

    private void sendCurrentStatus() {
        messageSender.send(new Message<>("status", getStatus()));
    }
}