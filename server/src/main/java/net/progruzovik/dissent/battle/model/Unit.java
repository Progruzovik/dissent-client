package net.progruzovik.dissent.battle.model;

import net.progruzovik.dissent.exception.InvalidMoveException;
import net.progruzovik.dissent.exception.InvalidShotException;
import net.progruzovik.dissent.battle.model.field.LocationStatus;
import net.progruzovik.dissent.model.entity.Gun;
import net.progruzovik.dissent.model.entity.Ship;
import net.progruzovik.dissent.model.util.Cell;

public final class Unit {

    private int actionPoints = 0;
    private Cell firstCell;

    private final Side side;
    private final Ship ship;

    public Unit(Cell firstCell, Side side, Ship ship) {
        this.firstCell = firstCell;
        this.side = side;
        this.ship = ship;
    }

    public int getActionPoints() {
        return actionPoints;
    }

    public int getWidth() {
        return ship.getHull().getWidth();
    }

    public int getHeight() {
        return ship.getHull().getHeight();
    }

    public Side getSide() {
        return side;
    }

    public Cell getFirstCell() {
        return firstCell;
    }

    public LocationStatus getLocationStatus() {
        switch (side) {
            case LEFT: return LocationStatus.UNIT_LEFT;
            case RIGHT: return LocationStatus.UNIT_RIGHT;
            case NONE: default: return LocationStatus.EMPTY;
        }
    }

    public Ship getShip() {
        return ship;
    }

    public boolean isOccupyCell(Cell cell) {
        return cell.getX() >= firstCell.getX() && cell.getX() < firstCell.getX() + ship.getHull().getWidth()
                && cell.getY() >= firstCell.getY() && cell.getY() < firstCell.getY() + ship.getHull().getHeight();
    }

    public void activate() {
        actionPoints = ship.getHull().getActionPoints();
    }

    public void move(Cell toCell, int movementCost) {
        if (movementCost > actionPoints) throw new InvalidMoveException(actionPoints, firstCell, toCell);
        firstCell = toCell;
        actionPoints -= movementCost;
    }

    public int shoot(int gunId, Unit target) {
        final Gun gun = ship.findGunById(gunId);
        if (gun.getShotCost() > actionPoints) throw new InvalidShotException();

        actionPoints -= gun.getShotCost();
        final int damage = gun.getDamage();
        target.getShip().setStrength(target.getShip().getStrength() - damage);
        return damage;
    }
}
