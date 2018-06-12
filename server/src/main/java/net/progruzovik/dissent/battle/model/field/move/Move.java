package net.progruzovik.dissent.battle.model.field.move;

import net.progruzovik.dissent.battle.model.util.Cell;
import org.springframework.lang.NonNull;

import java.util.List;

public final class Move {

    private final int cost;
    private final @NonNull List<Cell> cells;

    public Move(int cost, @NonNull List<Cell> cells) {
        this.cost = cost;
        this.cells = cells;
    }

    public int getCost() {
        return cost;
    }

    @NonNull
    public List<Cell> getCells() {
        return cells;
    }
}
