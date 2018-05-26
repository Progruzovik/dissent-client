package net.progruzovik.dissent.battle.model.field;

import net.progruzovik.dissent.battle.model.util.Cell;
import org.springframework.lang.NonNull;

import java.util.ArrayList;
import java.util.List;

public final class GunCells {

    private final @NonNull List<Cell> shotCells = new ArrayList<>();
    private final @NonNull List<Cell> targetCells = new ArrayList<>();

    @NonNull
    public List<Cell> getShotCells() {
        return shotCells;
    }

    @NonNull
    public List<Cell> getTargetCells() {
        return targetCells;
    }

    void clear() {
        shotCells.clear();
        targetCells.clear();
    }
}
