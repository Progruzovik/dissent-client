package net.progruzovik.dissent.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import net.progruzovik.dissent.battle.Side;

public final class Unit {

    private Side side = Side.None;
    private int col;
    private int row;

    private final Ship ship;

    public Unit(Ship ship) {
        this.ship = ship;
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

    public int getCol() {
        return col;
    }

    public void setCol(int col) {
        this.col = col;
    }

    public int getRow() {
        return row;
    }

    public void setRow(int row) {
        this.row = row;
    }

    public Ship getShip() {
        return ship;
    }
}
