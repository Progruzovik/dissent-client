package net.progruzovik.dissent.model.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import net.progruzovik.dissent.model.domain.battle.Side;
import net.progruzovik.dissent.model.entity.GunEntity;
import net.progruzovik.dissent.model.entity.HullEntity;
import org.springframework.lang.NonNull;

public final class LogEntryDto {

    private final @NonNull Side side;
    private final int damage;
    private final boolean isTargetDestroyed;

    private final @NonNull GunEntity gun;
    private final @NonNull HullEntity unitHull;
    private final @NonNull HullEntity targetHull;

    public LogEntryDto(@NonNull Side side, int damage, boolean isTargetDestroyed,
                       @NonNull GunEntity gun, @NonNull HullEntity unitHull, @NonNull HullEntity targetHull) {
        this.side = side;
        this.damage = damage;
        this.isTargetDestroyed = isTargetDestroyed;
        this.gun = gun;
        this.unitHull = unitHull;
        this.targetHull = targetHull;
    }

    @NonNull
    public Side getSide() {
        return side;
    }

    public int getDamage() {
        return damage;
    }

    @JsonProperty("isTargetDestroyed")
    public boolean isTargetDestroyed() {
        return isTargetDestroyed;
    }

    @NonNull
    public String getGunName() {
        return gun.getName();
    }

    @NonNull
    public String getUnitHullName() {
        return unitHull.getName();
    }

    @NonNull
    public String getTargetHullName() {
        return targetHull.getName();
    }
}
