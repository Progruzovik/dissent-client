package net.progruzovik.dissent.battle.model.field;

import net.progruzovik.dissent.battle.model.Unit;
import net.progruzovik.dissent.model.util.Cell;

import java.util.ArrayList;
import java.util.List;

final class Map {

    private final List<List<Location>> locations;

    Map(Cell size) {
        locations = new ArrayList<>(size.getX());
        for (int i = 0; i < size.getX(); i++) {
            locations.add(new ArrayList<>(size.getY()));
            for (int j = 0; j < size.getY(); j++) {
                locations.get(i).add(new Location());
            }
        }
    }

    int getMovementCost(Cell cell, int width, int height) {
        int result = 0;
        for (int i = 0; i < width; i++) {
            for (int j = 0; j < height; j++) {
                final int movementCost = locations.get(cell.getX() + i).get(cell.getY() + j).getMovementCost();
                if (movementCost > result) {
                    result = movementCost;
                }
            }
        }
        return result;
    }

    LocationStatus getLocationStatus(Cell cell) {
        return getLocationStatus(cell.getX(), cell.getY());
    }

    LocationStatus getLocationStatus(int x, int y) {
        return locations.get(x).get(y).getCurrentStatus();
    }

    void createLocation(Cell cell, LocationStatus defaultStatus) {
        locations.get(cell.getX()).set(cell.getY(), new Location(defaultStatus));
    }

    void addUnit(Unit unit) {
        setLocationsStatusInBorders(unit.getFirstCell(), unit.getWidth(), unit.getHeight(), unit.getLocationStatus());
    }

    void moveUnit(Unit unit, Cell newCell) {
        final Cell firstCell = unit.getFirstCell();
        for (int i = 0; i < unit.getWidth(); i++) {
            for (int j = 0; j < unit.getHeight(); j++) {
                locations.get(firstCell.getX() + i).get(firstCell.getY() + j).resetStatusToDefault();
            }
        }
        setLocationsStatusInBorders(newCell, unit.getWidth(), unit.getHeight(), unit.getLocationStatus());
    }

    void destroyUnit(Unit unit) {
        final int width = unit.getWidth(), height = unit.getHeight();
        setLocationsStatusInBorders(unit.getFirstCell(), width, height, LocationStatus.UNIT_DESTROYED);
    }

    private void setLocationsStatusInBorders(Cell start, int width, int height, LocationStatus status) {
        for (int i = 0; i < width; i++) {
            for (int j = 0; j < height; j++) {
                locations.get(start.getX() + i).get(start.getY() + j).setCurrentStatus(status);
            }
        }
    }
}
