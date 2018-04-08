package net.progruzovik.dissent.battle.model.field;

import net.progruzovik.dissent.battle.model.Unit;
import net.progruzovik.dissent.battle.model.util.Cell;
import org.springframework.lang.NonNull;

import java.util.ArrayList;
import java.util.List;

final class Map {

    private final @NonNull Cell size;
    private final @NonNull List<List<Location>> locations;

    Map(@NonNull Cell size) {
        this.size = size;
        locations = new ArrayList<>(size.getX());
        for (int i = 0; i < size.getX(); i++) {
            locations.add(new ArrayList<>(size.getY()));
            for (int j = 0; j < size.getY(); j++) {
                locations.get(i).add(new Location());
            }
        }
    }

    @NonNull
    Cell getSize() {
        return size;
    }

    int findMovementCost(@NonNull Cell cell, int width, int height) {
        int result = 0;
        for (int i = 0; i < width; i++) {
            for (int j = 0; j < height; j++) {
                final Cell nextCell = new Cell(cell.getX() + i, cell.getY() + j);
                if (nextCell.isInBorders(size)) {
                    final int movementCost = locations.get(nextCell.getX()).get(nextCell.getY()).getMovementCost();
                    if (movementCost > result) {
                        result = movementCost;
                    }
                }
            }
        }
        return result;
    }

    @NonNull
    LocationStatus getLocationStatus(Cell cell) {
        return locations.get(cell.getX()).get(cell.getY()).getCurrentStatus();
    }

    void createLocation(@NonNull Cell cell, @NonNull LocationStatus defaultStatus) {
        locations.get(cell.getX()).set(cell.getY(), new Location(defaultStatus));
    }

    void addUnit(@NonNull Unit unit) {
        setLocationsStatus(unit.getFirstCell(), unit.getWidth(), unit.getHeight(), unit.getLocationStatus());
    }

    void moveUnit(@NonNull Unit unit, @NonNull Cell newCell) {
        final Cell firstCell = unit.getFirstCell();
        for (int i = 0; i < unit.getWidth(); i++) {
            for (int j = 0; j < unit.getHeight(); j++) {
                locations.get(firstCell.getX() + i).get(firstCell.getY() + j).resetStatusToDefault();
            }
        }
        setLocationsStatus(newCell, unit.getWidth(), unit.getHeight(), unit.getLocationStatus());
    }

    void destroyUnit(@NonNull Unit unit) {
        final int width = unit.getWidth(), height = unit.getHeight();
        setLocationsStatus(unit.getFirstCell(), width, height, LocationStatus.UNIT_DESTROYED);
    }

    private void setLocationsStatus(@NonNull Cell start, int width, int height, @NonNull LocationStatus status) {
        for (int i = 0; i < width; i++) {
            for (int j = 0; j < height; j++) {
                locations.get(start.getX() + i).get(start.getY() + j).setCurrentStatus(status);
            }
        }
    }
}
