package net.progruzovik.dissent.player;

import net.progruzovik.dissent.dao.GunDao;
import net.progruzovik.dissent.dao.ShipDao;
import net.progruzovik.dissent.model.Gun;
import net.progruzovik.dissent.model.Ship;
import net.progruzovik.dissent.model.Unit;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Component;

@Component
@Scope(value = "session", proxyMode = ScopedProxyMode.INTERFACES)
public final class SessionPlayer extends AbstractPlayer {

    public SessionPlayer(ShipDao shipDao, GunDao gunDao) {
        final Ship basicShip = shipDao.getShip(1);
        final Gun shrapnel = gunDao.getGun(1);
        getUnits().add(new Unit(basicShip, shrapnel, null));
        getUnits().add(new Unit(shipDao.getShip(2), shrapnel, gunDao.getGun(2)));
        getUnits().add(new Unit(basicShip, shrapnel, null));
    }
}
