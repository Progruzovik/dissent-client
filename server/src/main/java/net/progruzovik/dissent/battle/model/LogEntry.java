package net.progruzovik.dissent.battle.model;

import net.progruzovik.dissent.model.entity.Gun;
import net.progruzovik.dissent.model.entity.Hull;

public final class LogEntry {

    private final int damage;

    private final Gun gun;
    private final Hull unitHull;
    private final Hull targetHull;

    public LogEntry(int damage, Gun gun, Hull unitHull, Hull targetHull) {
        this.damage = damage;
        this.gun = gun;
        this.unitHull = unitHull;
        this.targetHull = targetHull;
    }

    public int getDamage() {
        return damage;
    }

    public String getGunName() {
        return gun.getName();
    }

    public String getUnitHullName() {
        return unitHull.getName();
    }

    public String getTargetHullName() {
        return targetHull.getName();
    }
}
