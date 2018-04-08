package net.progruzovik.dissent.battle.model;

import net.progruzovik.dissent.battle.exception.InvalidMoveException;
import net.progruzovik.dissent.battle.exception.InvalidShotException;
import net.progruzovik.dissent.battle.model.field.LocationStatus;
import net.progruzovik.dissent.model.entity.Gun;
import net.progruzovik.dissent.model.entity.Ship;
import net.progruzovik.dissent.battle.model.util.Cell;
import org.springframework.lang.NonNull;

public final class Unit {

    private int actionPoints = 0;
    private @NonNull Cell firstCell;

    private final @NonNull Side side;
    private final @NonNull Ship ship;

    Unit(@NonNull Cell firstCell, @NonNull Side side, @NonNull Ship ship) {
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

    @NonNull
    public Side getSide() {
        return side;
    }

    @NonNull
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

    @NonNull
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
        if (gun.getShotCost() > actionPoints) {
            final String message = String.format("Not enough action points (%d/%d)!", actionPoints, gun.getShotCost());
            throw new InvalidShotException(message);
        }

        actionPoints -= gun.getShotCost();
        final int damage = gun.getDamage();
        target.getShip().setStrength(target.getShip().getStrength() - damage);
        return damage;
    }
}
