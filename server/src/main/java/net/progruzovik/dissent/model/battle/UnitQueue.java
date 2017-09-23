package net.progruzovik.dissent.model.battle;

import net.progruzovik.dissent.model.Gun;
import net.progruzovik.dissent.model.Hull;
import net.progruzovik.dissent.model.Unit;
import net.progruzovik.dissent.model.util.Cell;

import java.util.HashSet;
import java.util.LinkedList;
import java.util.Queue;
import java.util.Set;

public class UnitQueue {

    private int turnNumber = 1;
    private final LinkedList<Unit> queue = new LinkedList<>();

    private final Set<Hull> uniqueHulls = new HashSet<>();
    private final Set<Gun> uniqueGuns = new HashSet<>();

    public int getTurnNumber() {
        return turnNumber;
    }

    public Unit getCurrentUnit() {
        return queue.element();
    }

    public Queue<Unit> getQueue() {
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
        uniqueHulls.add(unit.getHull());
        if (unit.getFirstGun() != null) {
            uniqueGuns.add(unit.getFirstGun());
        }
        if (unit.getSecondGun() != null) {
            uniqueGuns.add(unit.getSecondGun());
        }
    }

    public Unit removeUnitOnCell(Cell cell) {
        for (int i = 0; i < queue.size(); i++) {
            final Unit target = queue.get(i);
            if (target.getCell().equals(cell)) {
                queue.remove(i);
                return target;
            }
        }
        return null;
    }

    public void nextTurn() {
        turnNumber++;
        queue.offer(queue.poll());
    }
}
