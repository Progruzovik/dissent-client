package net.progruzovik.dissent.model.battle;

import com.fasterxml.jackson.annotation.JsonIgnore;
import net.progruzovik.dissent.model.entity.Ship;
import net.progruzovik.dissent.model.util.Cell;

public final class Unit {

    private boolean isDestroyed = false;

    private int movementPoints = 0;
    private int firstGunCooldown = 0;
    private int secondGunCooldown = 0;
    
    private Cell cell;
    
    private final Ship ship;
    private final Side side;

    public Unit(Cell cell, Ship ship, Side side) {
        this.cell = cell;
        this.ship = ship;
        this.side = side;
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

    public Ship getShip() {
        return ship;
    }

    public void makeCurrent() {
        movementPoints = ship.getHull().getSpeed();
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
        if (dischargeGun(gunId)) {
            target.isDestroyed = true;
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
