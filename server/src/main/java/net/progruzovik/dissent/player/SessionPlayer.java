package net.progruzovik.dissent.player;

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

    public SessionPlayer(ShipDao shipDao) {
        final Gun firstGun = new Gun("sharpnel", 14, 3,
                "shell", 3, 15);
        final Gun secondGun = new Gun("laser", 10, 2, "beam");
        final Ship basicShip = shipDao.getShip(1);
        getUnits().add(new Unit(basicShip, firstGun, null));
        getUnits().add(new Unit(shipDao.getShip(2), firstGun, secondGun));
        getUnits().add(new Unit(basicShip, firstGun, null));
    }
}
