package net.progruzovik.dissent.model.battle;

import com.fasterxml.jackson.annotation.JsonIgnore;
import net.progruzovik.dissent.model.entity.Gun;
import net.progruzovik.dissent.model.entity.Hull;
import net.progruzovik.dissent.model.util.Cell;

public final class Unit {

    private boolean isDestroyed = false;

    private int movementPoints = 0;
    private int firstGunCooldown = 0;
    private int secondGunCooldown = 0;

    private Side side = Side.NONE;
    private Cell cell;

    private final Hull hull;

    private final Gun firstGun;
    private final Gun secondGun;

    public Unit(Hull hull, Gun firstGun, Gun secondGun) {
        this.hull = hull;
        this.firstGun = firstGun;
        this.secondGun = secondGun;
    }

    @JsonIgnore
    public boolean isDestroyed() {
        return isDestroyed;
    }

    @JsonIgnore
    public int getMovementPoints() {
        return movementPoints;
    }

    public Side getSide() {
        return side;
    }

    public Cell getCell() {
        return cell;
    }

    public int getHullId() {
        return hull.getId();
    }

    @JsonIgnore
    public Hull getHull() {
        return hull;
    }

    public int getFirstGunId() {
        return firstGun == null ? 0 : firstGun.getId();
    }

    @JsonIgnore
    public Gun getFirstGun() {
        return firstGun;
    }

    public int getSecondGunId() {
        return secondGun == null ? 0 : secondGun.getId();
    }

    @JsonIgnore
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

    public void init(Side side, Cell cell) {
        this.side = side;
        this.cell = cell;
    }

    public void makeCurrent() {
        movementPoints = hull.getSpeed();
        if (firstGunCooldown > 0) {
            firstGunCooldown--;
        }
        if (secondGunCooldown > 0) {
            secondGunCooldown--;
        }
    }

    public boolean move(Cell nextCell) {
        final int distance = cell.findDistanceToCell(nextCell);
        if (distance <= movementPoints) {
            cell = nextCell;
            movementPoints -= distance;
            return true;
        }
        return false;
    }

    public boolean shoot(int gunId, Unit target) {
        if (makeGunCooldown(gunId)) {
            target.isDestroyed = true;
            return true;
        }
        return false;
    }

    private boolean makeGunCooldown(int gunId) {
        if (firstGun != null && gunId == firstGun.getId() && firstGunCooldown == 0) {
            firstGunCooldown = firstGun.getCooldown();
            return true;
        }
        if (secondGun != null && gunId == secondGun.getId() && secondGunCooldown == 0) {
            secondGunCooldown = secondGun.getCooldown();
            return true;
        }
        return false;
    }
}
