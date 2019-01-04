package net.progruzovik.dissent.model.dto;

import net.progruzovik.dissent.battle.model.util.Cell;
import org.springframework.lang.NonNull;

@SuppressWarnings("unused")
public final class ShotDto {

    private final int gunId;
    private final int damage;

    private final @NonNull Cell cell;

    public ShotDto(int gunId, int damage, @NonNull Cell cell) {
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
