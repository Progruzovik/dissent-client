package net.progruzovik.dissent.model.player;

import net.progruzovik.dissent.dao.GunDao;
import net.progruzovik.dissent.dao.HullDao;
import net.progruzovik.dissent.model.Gun;
import net.progruzovik.dissent.model.Hull;
import net.progruzovik.dissent.model.Unit;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpSession;

@Component
@Scope(value = "session", proxyMode = ScopedProxyMode.INTERFACES)
public final class SessionPlayer extends AbstractPlayer {

    private final String id;

    public SessionPlayer(HttpSession session, HullDao shipDao, GunDao gunDao) {
        id = session.getId();
        final Hull basicHull = shipDao.getHull(1);
        final Gun shrapnel = gunDao.getGun(1);
        getUnits().add(new Unit(basicHull, shrapnel, null));
        getUnits().add(new Unit(shipDao.getHull(2), shrapnel, gunDao.getGun(2)));
        getUnits().add(new Unit(basicHull, shrapnel, null));
    }

    @Override
    public String getId() {
        return id;
    }
}
