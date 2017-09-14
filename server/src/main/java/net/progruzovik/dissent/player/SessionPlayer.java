package net.progruzovik.dissent.player;

import net.progruzovik.dissent.model.Gun;
import net.progruzovik.dissent.model.Ship;
import net.progruzovik.dissent.model.Unit;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Component;

@Component
@Scope(value = "session", proxyMode = ScopedProxyMode.INTERFACES)
public final class SessionPlayer extends AbstractPlayer {

    public SessionPlayer() {
        final Gun firstGun = new Gun("sharpnel", 14, 3,
                "shell", 3, 15);
        final Gun secondGun = new Gun("laser", 10, 2, "beam");
        final Ship basicShip = new Ship(3, "ship-2-2");
        getUnits().add(new Unit(basicShip, firstGun, null));
        getUnits().add(new Unit(new Ship(5, "ship-3-1"), firstGun, secondGun));
        getUnits().add(new Unit(basicShip, firstGun, null));
    }
}
