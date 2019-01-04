package net.progruzovik.dissent.battle.model.field;

import net.progruzovik.dissent.battle.model.util.Cell;
import org.springframework.lang.NonNull;

final class PathNode {

    private final int movementCost;
    private final @NonNull Cell cell;

    PathNode(int movementCost, @NonNull Cell cell) {
        this.movementCost = movementCost;
        this.cell = cell;
    }

    int getMovementCost() {
        return movementCost;
    }

    @NonNull
    Cell getCell() {
        return cell;
    }
}
