package net.progruzovik.dissent.model.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import net.progruzovik.dissent.battle.exception.InvalidGunIdException;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;

public final class Ship {

    private int strength;

    private @NonNull Hull hull;
    private @Nullable Gun firstGun;
    private @Nullable Gun secondGun;

    public Ship(@JsonProperty("strength") int strength,
                @JsonProperty("hull") @NonNull Hull hull,
                @JsonProperty("firstGun") @Nullable Gun firstGun,
                @JsonProperty("secondGun") @Nullable Gun secondGun) {
        this.strength = strength;
        this.hull = hull;
        this.firstGun = firstGun;
        this.secondGun = secondGun;
    }

    public Ship(@NonNull Hull hull, @Nullable Gun firstGun, @Nullable Gun secondGun) {
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
        } else if (strength >= hull.getStrength()) {
            this.strength = hull.getStrength();
        } else {
            this.strength = strength;
        }
    }

    @NonNull
    public Hull getHull() {
        return hull;
    }

    @Nullable
    public Gun getFirstGun() {
        return firstGun;
    }

    @Nullable
    public Gun getSecondGun() {
        return secondGun;
    }

    @NonNull
    public Gun findGunById(int gunId) {
        if (firstGun != null && gunId == firstGun.getId()) return firstGun;
        if (secondGun != null && gunId == secondGun.getId()) return secondGun;
        throw new InvalidGunIdException(gunId);
    }
}
