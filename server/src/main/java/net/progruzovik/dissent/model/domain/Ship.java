package net.progruzovik.dissent.model.domain;

import net.progruzovik.dissent.battle.exception.InvalidGunIdException;
import net.progruzovik.dissent.model.entity.GunEntity;
import net.progruzovik.dissent.model.entity.HullEntity;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;

public class Ship {

    private int strength;

    private final @NonNull HullEntity hull;
    private final @Nullable GunEntity firstGun;
    private final @Nullable GunEntity secondGun;

    public Ship(int strength, @NonNull HullEntity hull, @Nullable GunEntity firstGun, @Nullable GunEntity secondGun) {
        this.strength = strength;
        this.hull = hull;
        this.firstGun = firstGun;
        this.secondGun = secondGun;
    }

    public Ship(@NonNull HullEntity hull, @Nullable GunEntity firstGun, @Nullable GunEntity secondGun) {
        this.strength = hull.getStrength();
        this.hull = hull;
        this.firstGun = firstGun;
        this.secondGun = secondGun;
    }

    public int getStrength() {
        return strength;
    }

    public void setStrength(int strength) {
        if (strength <= 0) {
            this.strength = 0;
        } else {
            this.strength = Math.min(strength, hull.getStrength());
        }
    }

    @NonNull
    public HullEntity getHull() {
        return hull;
    }

    @Nullable
    public GunEntity getFirstGun() {
        return firstGun;
    }

    @Nullable
    public GunEntity getSecondGun() {
        return secondGun;
    }

    @NonNull
    public GunEntity findGunById(int gunId) {
        if (firstGun != null && gunId == firstGun.getId()) return firstGun;
        if (secondGun != null && gunId == secondGun.getId()) return secondGun;
        throw new InvalidGunIdException(gunId);
    }
}
