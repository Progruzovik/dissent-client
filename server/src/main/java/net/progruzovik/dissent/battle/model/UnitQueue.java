package net.progruzovik.dissent.battle.model;

import net.progruzovik.dissent.battle.exception.EmptyCellException;
import net.progruzovik.dissent.battle.model.util.Cell;

import java.util.LinkedList;
import java.util.List;

public final class UnitQueue {

    private final LinkedList<Unit> queue = new LinkedList<>();

    boolean hasUnitsOnBothSides() {
        return queue.stream().anyMatch(u -> u.getSide() != getCurrentUnit().getSide());
    }

    Unit getCurrentUnit() {
        return queue.element();
    }

    List<Unit> getUnits() {
        return queue;
    }

    void addUnit(Unit unit) {
        queue.offer(unit);
    }

    Unit findUnitOnCell(Cell cell) {
        for (final Unit unit : queue) {
            if (unit.isOccupyCell(cell)) {
                return unit;
            }
        }
        throw new EmptyCellException(cell);
    }

    void nextTurn() {
        queue.offer(queue.poll());
    }
}
