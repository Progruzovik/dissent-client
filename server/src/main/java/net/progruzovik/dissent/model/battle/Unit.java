package net.progruzovik.dissent.model.battle;

import net.progruzovik.dissent.exception.InvalidMoveException;
import net.progruzovik.dissent.model.battle.field.LocationStatus;
import net.progruzovik.dissent.model.entity.Ship;
import net.progruzovik.dissent.model.util.Cell;

public final class Unit {

    private int actionPoints = 0;
    private int firstGunCooldown = 0;
    private int secondGunCooldown = 0;

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
        if (firstGunCooldown > 0) {
            firstGunCooldown--;
        }
        if (secondGunCooldown > 0) {
            secondGunCooldown--;
        }
    }

    public void move(Cell toCell, int movementCost) {
        if (movementCost > actionPoints) throw new InvalidMoveException(actionPoints, movementCost, cell, toCell);
        cell = toCell;
        actionPoints -= movementCost;
    }

    public boolean shoot(int gunId, Unit target) {
        if (dischargeGun(gunId)) {
            target.getShip().setStrength(0);
            return true;
        }
        return false;
    }

    private boolean dischargeGun(int gunId) {
        if (ship.getFirstGun() != null && gunId == ship.getFirstGun().getId() && firstGunCooldown == 0) {
            firstGunCooldown = ship.getFirstGun().getCooldown();
            return true;
        }
        if (ship.getSecondGun() != null && gunId == ship.getSecondGun().getId() && secondGunCooldown == 0) {
            secondGunCooldown = ship.getSecondGun().getCooldown();
            return true;
        }
        return false;
    }
}
