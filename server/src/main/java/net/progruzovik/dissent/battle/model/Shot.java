package net.progruzovik.dissent.battle.model;

import net.progruzovik.dissent.battle.model.util.Cell;
import org.springframework.lang.NonNull;

public final class Shot {

    private final int gunId;
    private final int damage;

    private final @NonNull Cell cell;

    Shot(int gunId, int damage, @NonNull Cell cell) {
        this.gunId = gunId;
        this.damage = damage;
        this.cell = cell;
    }

    public int getGunId() {
        return gunId;
    }

    public int getDamage() {
        return damage;
    }

    @NonNull
    public Cell getCell() {
        return cell;
    }
}
