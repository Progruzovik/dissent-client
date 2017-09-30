package net.progruzovik.dissent.model.battle;

import com.fasterxml.jackson.annotation.JsonIgnore;
import net.progruzovik.dissent.model.Gun;
import net.progruzovik.dissent.model.Hull;
import net.progruzovik.dissent.model.util.Cell;

public final class Unit {

    private boolean isDestroyed = false;

    private int movementPoints = 0;
    private int firstGunCooldown = 0;
    private int secondGunCooldown = 0;

    private Side side = Side.NONE;
    private Cell cell;

    private final Hull hull;

    private Gun preparedGun;
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

    @JsonIgnore
    public Gun getPreparedGun() {
        return preparedGun;
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

    public boolean prepareGun(int gunId) {
        if (gunId == -1) {
            preparedGun = null;
            return true;
        }
        if (gunId == firstGun.getId() && firstGunCooldown == 0) {
            preparedGun = firstGun;
            return true;
        }
        if (gunId == secondGun.getId() && secondGunCooldown == 0) {
            preparedGun = secondGun;
            return true;
        }
        return false;
    }

    public void shoot(Unit target) {
        if (preparedGun == firstGun) {
            firstGunCooldown = firstGun.getCooldown();
        } else {
            secondGunCooldown = secondGun.getCooldown();
        }
        preparedGun = null;
        target.isDestroyed = true;
    }
}
