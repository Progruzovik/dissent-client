package net.progruzovik.dissent.model.battle.field;

import net.progruzovik.dissent.model.util.Cell;

import java.util.List;

final class Move {

    private final int cost;
    private final List<Cell> cells;

    Move(int cost, List<Cell> cells) {
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
