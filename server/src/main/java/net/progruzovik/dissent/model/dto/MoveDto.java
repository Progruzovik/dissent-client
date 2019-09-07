package net.progruzovik.dissent.model.dto;

import net.progruzovik.dissent.model.domain.util.Cell;
import org.springframework.lang.NonNull;

import java.util.List;

public final class MoveDto {

    private final int cost;
    private final @NonNull List<Cell> cells;

    public MoveDto(int cost, @NonNull List<Cell> cells) {
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
