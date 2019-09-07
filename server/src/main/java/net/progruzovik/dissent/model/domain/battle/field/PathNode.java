package net.progruzovik.dissent.model.domain.battle.field;

import net.progruzovik.dissent.model.domain.util.Cell;
import org.springframework.lang.NonNull;

public final class PathNode {

    private final int movementCost;
    private final @NonNull Cell cell;

    PathNode(int movementCost, @NonNull Cell cell) {
        this.movementCost = movementCost;
        this.cell = cell;
    }

    public int getMovementCost() {
        return movementCost;
    }

    @NonNull
    public Cell getCell() {
        return cell;
    }
}
