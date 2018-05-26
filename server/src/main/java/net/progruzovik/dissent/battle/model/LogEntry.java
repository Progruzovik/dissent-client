package net.progruzovik.dissent.battle.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import net.progruzovik.dissent.model.entity.Gun;
import net.progruzovik.dissent.model.entity.Hull;
import org.springframework.lang.NonNull;

public final class LogEntry {

    private final @NonNull Side side;
    private final int damage;
    private final boolean isTargetDestroyed;

    private final @NonNull Gun gun;
    private final @NonNull Hull unitHull;
    private final @NonNull Hull targetHull;

    LogEntry(@NonNull Side side, int damage, boolean isTargetDestroyed,
             @NonNull Gun gun, @NonNull Hull unitHull, @NonNull Hull targetHull) {
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
