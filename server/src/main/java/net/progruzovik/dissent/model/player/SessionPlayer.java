package net.progruzovik.dissent.model.player;

import net.progruzovik.dissent.battle.Battle;
import net.progruzovik.dissent.dao.GunDao;
import net.progruzovik.dissent.dao.HullDao;
import net.progruzovik.dissent.model.battle.action.Action;
import net.progruzovik.dissent.model.battle.action.ActionType;
import net.progruzovik.dissent.model.entity.Gun;
import net.progruzovik.dissent.model.entity.Hull;
import net.progruzovik.dissent.model.battle.Unit;
import net.progruzovik.dissent.rest.deferred.DeferredAction;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.List;

@Component
@Scope(value = "session", proxyMode = ScopedProxyMode.TARGET_CLASS)
public class SessionPlayer implements Player {

    private final String id;
    private final List<Unit> units = new ArrayList<>();

    private BattleConnector battleConnector;

    public SessionPlayer(HttpSession session, HullDao shipDao, GunDao gunDao) {
        id = session.getId();
        final Hull basicHull = shipDao.getHull(1);
        final Gun shrapnel = gunDao.getGun(1);
        units.add(new Unit(basicHull, shrapnel, null));
        units.add(new Unit(shipDao.getHull(2), shrapnel, gunDao.getGun(2)));
        units.add(new Unit(basicHull, shrapnel, null));
    }

    @Override
    public String getId() {
        return id;
    }

    @Override
    public List<Unit> getUnits() {
        return units;
    }

    @Override
    public Battle getBattle() {
        return battleConnector.getBattle();
    }

    @Override
    public void setBattle(Battle battle) {
        if (battleConnector != null && battleConnector.getDeferredAction() != null) {
            battleConnector.getDeferredAction().setResult(new Action(ActionType.FINISH));
        }
        battleConnector = new BattleConnector(battle);
    }

    @Override
    public void newAction(int number, Action action) {
        if (battleConnector.getDeferredAction() != null && battleConnector.getDeferredAction().getNumber() == number) {
            battleConnector.getDeferredAction().setResult(action);
            battleConnector.setDeferredAction(null);
        }
    }

    public void setDeferredAction(DeferredAction deferredAction) {
        battleConnector.setDeferredAction(deferredAction);
    }
}
