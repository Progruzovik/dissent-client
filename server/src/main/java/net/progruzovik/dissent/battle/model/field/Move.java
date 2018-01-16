package net.progruzovik.dissent.battle.model.field;

import net.progruzovik.dissent.battle.model.util.Cell;

import java.util.List;

final class Move {

    private final int cost;
    private final List<Cell> cells;

    public Move(int cost, List<Cell> cells) {
        this.cost = cost;
        this.cells = cells;
    }

    public int getCost() {
        return cost;
    }

    public List<Cell> getCells() {
        return cells;
    }
}
