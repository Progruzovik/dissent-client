package net.progruzovik.dissent.model.domain.battle;

import net.progruzovik.dissent.model.domain.util.Cell;
import org.springframework.lang.NonNull;

import java.util.LinkedList;
import java.util.List;
import java.util.Optional;

public final class UnitQueue {

    private final @NonNull LinkedList<Unit> queue = new LinkedList<>();

    boolean hasUnitsOnBothSides() {
        return queue.stream().anyMatch(u -> u.getSide() != getCurrentUnit().getSide());
    }

    @NonNull
    Unit getCurrentUnit() {
        return queue.element();
    }

    @NonNull
    List<Unit> getUnits() {
        return queue;
    }

    void addUnit(@NonNull Unit unit) {
        queue.offer(unit);
    }

    @NonNull
    Optional<Unit> findUnitOnCell(Cell cell) {
        for (final Unit unit : queue) {
            if (unit.isOccupyCell(cell)) {
                return Optional.of(unit);
            }
        }
        return Optional.empty();
    }

    void nextTurn() {
        queue.offer(queue.poll());
    }
}
