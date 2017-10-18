package net.progruzovik.dissent.model.player;

import com.fasterxml.jackson.databind.ObjectMapper;
import net.progruzovik.dissent.battle.Battle;
import net.progruzovik.dissent.battle.PlayerQueue;
import net.progruzovik.dissent.battle.ScenarioDigest;
import net.progruzovik.dissent.dao.GunDao;
import net.progruzovik.dissent.dao.HullDao;
import net.progruzovik.dissent.model.battle.action.Action;
import net.progruzovik.dissent.model.battle.action.ActionType;
import net.progruzovik.dissent.model.battle.action.DeferredAction;
import net.progruzovik.dissent.model.entity.Gun;
import net.progruzovik.dissent.model.entity.Hull;
import net.progruzovik.dissent.model.entity.Ship;
import net.progruzovik.dissent.model.socket.WebSocketSessionSender;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.List;

@Component
@Scope(value = "session", proxyMode = ScopedProxyMode.INTERFACES)
public final class SessionPlayer implements Player {

    private final String id;
    private final List<Ship> ships = new ArrayList<>();
    private Status status = Status.IDLE;

    private final PlayerQueue queue;
    private final ScenarioDigest scenarioDigest;
    private final WebSocketSessionSender webSocketSessionSender;
    private BattleConnector battleConnector;

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
        webSocketSessionSender = new WebSocketSessionSender(mapper);

        session.setAttribute(Player.NAME, this);
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
        webSocketSessionSender.sendStatusMessage(status);
    }

    @Override
    public Battle getBattle() {
        return battleConnector.getBattle();
    }

    @Override
    public void setBattle(Battle battle) {
        if (battle != null) {
            setStatus(Status.IN_BATTLE);
            if (battleConnector != null && battleConnector.getDeferredAction() != null) {
                battleConnector.getDeferredAction().setResult(new Action(ActionType.FINISH));
            }
            battleConnector = new BattleConnector(battle);
        }
    }

    @Override
    public WebSocketSessionSender getWebSocketSessionSender() {
        return webSocketSessionSender;
    }

    @Override
    public void setDeferredAction(DeferredAction deferredAction) {
        battleConnector.setDeferredAction(deferredAction);
    }

    @Override
    public boolean addToQueue() {
        if (status != Status.IDLE) return false;
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
        if (status != Status.IDLE) return false;
        scenarioDigest.start(this);
        return true;
    }

    @Override
    public void newAction(int number, Action action) {
        if (battleConnector.getDeferredAction() != null && battleConnector.getDeferredAction().getNumber() == number) {
            battleConnector.getDeferredAction().setResult(action);
            battleConnector.setDeferredAction(null);
        }
    }

    @Override
    public void act() { }
}
