package net.progruzovik.dissent.battle.model;

import net.progruzovik.dissent.model.entity.Gun;
import net.progruzovik.dissent.model.entity.Hull;
import org.springframework.lang.NonNull;

public final class LogEntry {

    private final int damage;

    private final @NonNull Gun gun;
    private final @NonNull Hull unitHull;
    private final @NonNull Hull targetHull;

    LogEntry(int damage, @NonNull Gun gun, @NonNull Hull unitHull, @NonNull Hull targetHull) {
        this.damage = damage;
        this.gun = gun;
        this.unitHull = unitHull;
        this.targetHull = targetHull;
    }

    public int getDamage() {
        return damage;
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
