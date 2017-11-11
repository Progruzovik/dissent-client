package net.progruzovik.dissent.model.battle;

import net.progruzovik.dissent.model.entity.Gun;
import net.progruzovik.dissent.model.entity.Hull;
import net.progruzovik.dissent.model.util.Cell;

import java.util.*;

public final class UnitQueue {

    private final LinkedList<Unit> queue = new LinkedList<>();

    private final Set<Hull> uniqueHulls = new HashSet<>();
    private final Set<Gun> uniqueGuns = new HashSet<>();

    public boolean hasUnitsOnBothSides() {
        return queue.stream().anyMatch(u -> u.getSide() != getCurrentUnit().getSide());
    }

    public Unit getCurrentUnit() {
        return queue.element();
    }

    public List<Unit> getUnits() {
        return queue;
    }

    public Set<Hull> getUniqueHulls() {
        return uniqueHulls;
    }

    public Set<Gun> getUniqueGuns() {
        return uniqueGuns;
    }

    public void addUnit(Unit unit) {
        queue.offer(unit);
        uniqueHulls.add(unit.getShip().getHull());
        if (unit.getShip().getFirstGun() != null) {
            uniqueGuns.add(unit.getShip().getFirstGun());
        }
        if (unit.getShip().getSecondGun() != null) {
            uniqueGuns.add(unit.getShip().getSecondGun());
        }
    }

    public Unit getUnitOnCell(Cell cell) {
        for (final Unit unit : queue) {
            if (unit.getCell().equals(cell)) {
                return unit;
            }
        }
        return null;
    }

    public void nextTurn() {
        queue.offer(queue.poll());
    }
}
