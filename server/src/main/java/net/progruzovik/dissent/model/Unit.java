package net.progruzovik.dissent.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import net.progruzovik.dissent.battle.Side;
import net.progruzovik.dissent.model.util.Cell;

public final class Unit {

    private int movementPoints = 0;

    private Side side = Side.NONE;
    private Cell cell;

    private final Ship ship;
    private final Gun firstGun;
    private final Gun secondGun;

    public Unit(Ship ship, Gun firstGun, Gun secondGun) {
        this.ship = ship;
        this.firstGun = firstGun;
        this.secondGun = secondGun;
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

    public int getShipId() {
        return ship.getId();
    }

    @JsonIgnore
    public Ship getShip() {
        return ship;
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
        movementPoints = ship.getSpeed();
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
}
