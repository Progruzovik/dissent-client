package net.progruzovik.dissent.captain.model;

import net.progruzovik.dissent.model.entity.Gun;
import net.progruzovik.dissent.model.entity.Hull;
import net.progruzovik.dissent.model.entity.Ship;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public final class Fleet {

    private final List<Ship> ships = new ArrayList<>();
    private final Set<Hull> uniqueHulls = new HashSet<>();

    private final Set<Gun> uniqueGuns = new HashSet<>();

    public List<Ship> getShips() {
        return ships;
    }

    public Set<Hull> getUniqueHulls() {
        return uniqueHulls;
    }

    public Set<Gun> getUniqueGuns() {
        return uniqueGuns;
    }

    public void addShip(Ship ship) {
        ships.add(ship);
        uniqueHulls.add(ship.getHull());
        if (ship.getFirstGun() != null) {
            uniqueGuns.add(ship.getFirstGun());
        }
        if (ship.getSecondGun() != null) {
            uniqueGuns.add(ship.getSecondGun());
        }
    }
}
