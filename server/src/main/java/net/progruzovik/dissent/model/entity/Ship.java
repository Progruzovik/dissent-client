package net.progruzovik.dissent.model.entity;

public final class Ship {

    private int strength;

    private Hull hull;
    private Gun firstGun;
    private Gun secondGun;

    public Ship(Hull hull, Gun firstGun, Gun secondGun) {
        this.strength = hull.getStrength();
        this.hull = hull;
        this.firstGun = firstGun;
        this.secondGun = secondGun;
    }

    public Ship() { }

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

    public Hull getHull() {
        return hull;
    }

    public Gun getFirstGun() {
        return firstGun;
    }

    public Gun getSecondGun() {
        return secondGun;
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
