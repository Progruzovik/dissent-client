package net.progruzovik.dissent.battle.model;

import net.progruzovik.dissent.model.util.Cell;

import java.util.LinkedList;
import java.util.List;

public final class UnitQueue {

    private final LinkedList<Unit> queue = new LinkedList<>();

    public boolean hasUnitsOnBothSides() {
        return queue.stream().anyMatch(u -> u.getSide() != getCurrentUnit().getSide());
    }

    public Unit getCurrentUnit() {
        return queue.element();
    }

    public List<Unit> getUnits() {
        return queue;
    }

    public void addUnit(Unit unit) {
        queue.offer(unit);
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
