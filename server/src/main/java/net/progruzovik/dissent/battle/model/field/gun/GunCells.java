package net.progruzovik.dissent.battle.model.field.gun;

import net.progruzovik.dissent.battle.model.util.Cell;
import org.springframework.lang.NonNull;

import java.util.ArrayList;
import java.util.List;

public final class GunCells {

    private final @NonNull List<Target> targets = new ArrayList<>();
    private final @NonNull List<Cell> shotCells = new ArrayList<>();

    @NonNull
    public List<Target> getTargets() {
        return targets;
    }

    @NonNull
    public List<Cell> getShotCells() {
        return shotCells;
    }

    public void clear() {
        targets.clear();
        shotCells.clear();
    }
}
