package net.progruzovik.dissent.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import net.progruzovik.dissent.battle.Side;
import net.progruzovik.dissent.util.Point;

public final class Unit {

    private Side side = Side.None;
    private final Point cell = new Point();

    private final Ship ship;
    private final Gun firstGun;
    private final Gun secondGun;

    public Unit(Ship ship, Gun firstGun, Gun secondGun) {
        this.ship = ship;
        this.firstGun = firstGun;
        this.secondGun = secondGun;
    }

    @JsonIgnore
    public Side getSide() {
        return side;
    }

    public int getSideValue() {
        return side.ordinal();
    }

    public void setSide(Side side) {
        this.side = side;
    }

    public Point getCell() {
        return cell;
    }

    public void setCell(Point cell) {
        this.cell.set(cell);
    }

    @JsonIgnore
    public Ship getShip() {
        return ship;
    }

    public int getShipId() {
        return ship.getId();
    }

    public Gun getFirstGun() {
        return firstGun;
    }

    public Gun getSecondGun() {
        return secondGun;
    }
}
