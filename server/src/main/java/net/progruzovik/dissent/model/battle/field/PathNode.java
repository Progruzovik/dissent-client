package net.progruzovik.dissent.model.battle.field;

import net.progruzovik.dissent.model.util.Cell;

public final class PathNode {

    private final int movementCost;
    private final Cell cell;

    PathNode(int movementCost, Cell cell) {
        this.movementCost = movementCost;
        this.cell = cell;
    }

    public int getMovementCost() {
        return movementCost;
    }

    public Cell getCell() {
        return cell;
    }
}
