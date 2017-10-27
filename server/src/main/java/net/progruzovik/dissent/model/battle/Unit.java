package net.progruzovik.dissent.model.battle;

import net.progruzovik.dissent.exception.InvalidMoveException;
import net.progruzovik.dissent.exception.InvalidShotException;
import net.progruzovik.dissent.model.battle.field.LocationStatus;
import net.progruzovik.dissent.model.entity.Gun;
import net.progruzovik.dissent.model.entity.Ship;
import net.progruzovik.dissent.model.util.Cell;

public final class Unit {

    private int actionPoints = 0;

    private final Side side;
    private Cell cell;
    private final Ship ship;

    public Unit(Side side, Cell cell, Ship ship) {
        this.side = side;
        this.cell = cell;
        this.ship = ship;
    }

    public int getActionPoints() {
        return actionPoints;
    }

    public Side getSide() {
        return side;
    }

    public Cell getCell() {
        return cell;
    }

    public LocationStatus getCellStatus() {
        switch (side) {
            case LEFT: return LocationStatus.UNIT_LEFT;
            case RIGHT: return LocationStatus.UNIT_RIGHT;
            case NONE: default: return LocationStatus.EMPTY;
        }
    }

    public Ship getShip() {
        return ship;
    }

    public void activate() {
        actionPoints = ship.getHull().getSpeed();
    }

    public void move(Cell toCell, int movementCost) {
        if (movementCost > actionPoints) throw new InvalidMoveException(actionPoints, movementCost, cell, toCell);
        cell = toCell;
        actionPoints -= movementCost;
    }

    public void shoot(int gunId, Unit target) {
        final Gun gun = findGunById(gunId);
        if (gun == null || gun.getShotCost() <= actionPoints) throw new InvalidShotException();

        actionPoints -= gun.getShotCost();
        target.getShip().setStrength(0);
    }

    private Gun findGunById(int gunId) {
        if (gunId == ship.getFirstGunId()) return ship.getFirstGun();
        if (gunId == ship.getSecondGunId()) return ship.getSecondGun();
        return null;
    }
}
