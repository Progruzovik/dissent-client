package net.progruzovik.dissent.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

public final class Ship {

    private Hull hull;

    private Gun firstGun;
    private Gun secondGun;

    public Ship() { }

    public Ship(Hull hull, Gun firstGun, Gun secondGun) {
        this.hull = hull;
        this.firstGun = firstGun;
        this.secondGun = secondGun;
    }

    @JsonIgnore
    public Hull getHull() {
        return hull;
    }

    public int getHullId() {
        return hull.getId();
    }

    @JsonIgnore
    public Gun getFirstGun() {
        return firstGun;
    }

    public int getFirstGunId() {
        return firstGun == null ? 0 : firstGun.getId();
    }

    @JsonIgnore
    public Gun getSecondGun() {
        return secondGun;
    }

    public int getSecondGunId() {
        return secondGun == null ? 0 : secondGun.getId();
    }

    public Gun getGun(int gunId) {
        if (firstGun != null && gunId == firstGun.getId()) {
            return firstGun;
        }
        if (secondGun != null && gunId == secondGun.getId()) {
            return secondGun;
        }
        return null;
    }
}
