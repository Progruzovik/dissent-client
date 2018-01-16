package net.progruzovik.dissent.battle.model.field;

import net.progruzovik.dissent.battle.model.util.Cell;

import java.util.ArrayList;
import java.util.List;

public final class GunCells {

    private final List<Cell> shotCells = new ArrayList<>();
    private final List<Cell> targetCells = new ArrayList<>();

    GunCells() { }

    public List<Cell> getShotCells() {
        return shotCells;
    }

    public List<Cell> getTargetCells() {
        return targetCells;
    }

    void clear() {
        shotCells.clear();
        targetCells.clear();
    }
}
