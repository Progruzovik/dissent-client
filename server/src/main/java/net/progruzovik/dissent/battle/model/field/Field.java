package net.progruzovik.dissent.battle.model.field;

import net.progruzovik.dissent.battle.exception.InvalidMoveException;
import net.progruzovik.dissent.battle.exception.InvalidUnitException;
import net.progruzovik.dissent.battle.model.Side;
import net.progruzovik.dissent.battle.model.Unit;
import net.progruzovik.dissent.battle.model.util.Cell;
import net.progruzovik.dissent.battle.model.util.Point;
import net.progruzovik.dissent.model.entity.Gun;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;

import java.util.*;
import java.util.concurrent.ThreadLocalRandom;
import java.util.function.Predicate;

public final class Field {

    public static final int UNIT_INDENT = 3;
    public static final int BORDER_INDENT = 4;

    private final @NonNull Map map;
    private final @NonNull List<Cell> asteroids = new ArrayList<>();
    private final @NonNull List<Cell> clouds = new ArrayList<>();
    private final @NonNull
    List<Unit> destroyedUnits = new ArrayList<>();

    private @Nullable Unit activeUnit = null;
    private int preparedGunId = Gun.NO_GUN_ID;
    private final @NonNull List<List<PathNode>> paths;
    private @NonNull List<Cell> reachableCells = Collections.emptyList();
    private final @NonNull GunCells gunCells = new GunCells();

    public Field(@NonNull Cell size) {
        map = new Map(size);
        paths = new ArrayList<>(size.getX());
        for (int i = 0; i < size.getX(); i++) {
            paths.add(new ArrayList<>(Collections.nCopies(size.getY(), null)));
        }
        generateEnvironment();
    }

    @NonNull
    public Cell getSize() {
        return map.getSize();
    }

    public void setActiveUnit(@NonNull Unit activeUnit) {
        final LocationStatus unitLocation = map.getLocationStatus(activeUnit.getFirstCell());
        if (activeUnit.getSide() == Side.NONE || unitLocation != activeUnit.getLocationStatus()) {
            throw new InvalidUnitException(activeUnit);
        }
        this.activeUnit = activeUnit;
        updateActiveUnit();
    }

    @NonNull
    public List<Cell> getAsteroids() {
        return asteroids;
    }

    @NonNull
    public List<Cell> getClouds() {
        return clouds;
    }

    @NonNull
    public List<Unit> getDestroyedUnits() {
        return destroyedUnits;
    }

    @NonNull
    public List<List<PathNode>> getPaths() {
        return paths;
    }

    @NonNull
    public List<Cell> getReachableCells() {
        return reachableCells;
    }

    public boolean canActiveUnitHitCell(int gunId, @NonNull Cell cell) {
        return preparedGunId == gunId && gunCells.getTargetCells().contains(cell);
    }

    public void addUnit(@NonNull Unit unit) {
        map.addUnit(unit);
    }

    public void updateActiveUnit() {
        preparedGunId = Gun.NO_GUN_ID;
        for (final List<PathNode> currentPath : paths) {
            for (int j = 0; j < currentPath.size(); j++) {
                currentPath.set(j, null);
            }
        }
        if (activeUnit == null) {
            reachableCells.clear();
        } else {
            final int width = activeUnit.getWidth(), height = activeUnit.getHeight();
            final PathNode firstNode = new PathNode(0, activeUnit.getFirstCell());
            paths.get(activeUnit.getFirstCell().getX()).set(activeUnit.getFirstCell().getY(), firstNode);
            final Queue<Cell> cellQueue = new LinkedList<>();
            cellQueue.offer(activeUnit.getFirstCell());
            while (!cellQueue.isEmpty()) {
                final Cell cell = cellQueue.remove();
                final int distanceToCell = paths.get(cell.getX()).get(cell.getY()).getMovementCost();
                for (final Cell neighbor : findNeighborsForCell(cell)) {
                    final int distanceToNeighbor = distanceToCell + map.findMovementCost(neighbor, width, height);
                    final PathNode pathFromNeighbor = paths.get(neighbor.getX()).get(neighbor.getY());
                    if (distanceToNeighbor <= activeUnit.getActionPoints()
                            && (pathFromNeighbor == null || pathFromNeighbor.getMovementCost() > distanceToNeighbor)) {
                        paths.get(neighbor.getX()).set(neighbor.getY(), new PathNode(distanceToNeighbor, cell));
                        cellQueue.offer(neighbor);
                    }
                }
            }
            reachableCells = findNeighborsInRadius(activeUnit.getFirstCell(),
                    activeUnit.getActionPoints(), this::isCellReachable);
        }
        gunCells.clear();
    }

    public void resetActiveUnit() {
        activeUnit = null;
        updateActiveUnit();
    }

    @NonNull
    public Move moveActiveUnit(@NonNull Cell cell) {
        assert activeUnit != null;
        if (!cell.isInBorders(map.getSize()) || !isCellReachable(cell)) {
            throw new InvalidMoveException(activeUnit.getActionPoints(), activeUnit.getFirstCell(), cell);
        }

        final int movementCost = paths.get(cell.getX()).get(cell.getY()).getMovementCost();
        map.moveUnit(activeUnit, cell);
        final List<Cell> cells = new ArrayList<>();
        Cell pathCell = cell;
        while (!pathCell.equals(activeUnit.getFirstCell())) {
            cells.add(pathCell);
            pathCell = paths.get(pathCell.getX()).get(pathCell.getY()).getCell();
        }
        activeUnit.move(cell, movementCost);
        updateActiveUnit();
        return new Move(movementCost, cells);
    }

    @NonNull
    public GunCells getGunCells(int gunId) {
        if (preparedGunId != gunId) {
            preparedGunId = gunId;
            gunCells.clear();

            if (activeUnit != null) {
                final Cell unitCell = activeUnit.getFirstCell();
                final int radius = activeUnit.getShip().findGunById(gunId).getRadius();
                final List<Cell> availableCells = findNeighborsInRadius(activeUnit.getFirstCell(),
                        activeUnit.getWidth(), activeUnit.getHeight(), radius, c -> {
                            for (int i = 0; i < activeUnit.getWidth(); i++) {
                                for (int j = 0; j < activeUnit.getHeight(); j++) {
                                    final Cell cell = new Cell(unitCell.getX() + i, unitCell.getY() + j);
                                    if (cell.isInBorders(map.getSize()) && isCellCanBeShot(cell, c)) {
                                        return true;
                                    }
                                }
                            }
                            return false;
                        });
                final LocationStatus targetStatus = activeUnit.getLocationStatus() == LocationStatus.UNIT_LEFT
                        ? LocationStatus.UNIT_RIGHT : LocationStatus.UNIT_LEFT;
                for (final Cell cell : availableCells) {
                    final LocationStatus locationStatus = map.getLocationStatus(cell);
                    if (locationStatus == LocationStatus.EMPTY) {
                        gunCells.getShotCells().add(cell);
                    }  else if (locationStatus == targetStatus) {
                        gunCells.getTargetCells().add(cell);
                    }
                }
            }
        }
        return gunCells;
    }

    public void destroyUnit(@NonNull Unit unit) {
        destroyedUnits.add(unit);
        map.destroyUnit(unit);
        gunCells.getTargetCells().remove(unit.getFirstCell());
    }

    private boolean isCellReachable(@NonNull Cell cell) {
        if (paths.get(cell.getX()).get(cell.getY()) == null) return false;
        assert activeUnit != null;

        for (int i = 0; i < activeUnit.getWidth(); i++) {
            for (int j = 0; j < activeUnit.getHeight(); j++) {
                final Cell nextCell = new Cell(cell.getX() + i, cell.getY() + j);
                if (!nextCell.isInBorders(map.getSize())) return false;
                final LocationStatus status = map.getLocationStatus(nextCell);
                if (status != LocationStatus.EMPTY
                        && status != LocationStatus.CLOUD && !activeUnit.isOccupyCell(nextCell)) {
                    return false;
                }
            }
        }
        return true;
    }

    private boolean isCellCanBeShot(@NonNull Cell from, @NonNull Cell cell) {
        assert activeUnit != null;
        final List<Cell> cellsInBetween = findCellsInBetween(from, cell);
        for (int k = 1; k < cellsInBetween.size() - 1; k++) {
            final LocationStatus locationStatus = map.getLocationStatus(cellsInBetween.get(k));
            if (locationStatus != LocationStatus.EMPTY && !activeUnit.isOccupyCell(cellsInBetween.get(k))) {
                return false;
            }
        }
        return true;
    }

    @NonNull
    private List<Cell> findNeighborsForCell(@NonNull Cell cell) {
        return findNeighborsInRadius(cell, 1, c -> true);
    }

    @NonNull
    private List<Cell> findNeighborsInRadius(@NonNull Cell start, int centerWidth, int centerHeight,
                                             int radius, @NonNull Predicate<Cell> filter) {
        final List<Cell> result = new ArrayList<>();
        for (int i = 1; i <= radius; i++) {
            for (int j = 1; j <= radius - i; j++) {
                result.add(new Cell(start.getX() - i, start.getY() - j));
                result.add(new Cell(start.getX() - i, start.getY() + j + centerHeight  - 1));
                result.add(new Cell(start.getX() + i + centerWidth - 1, start.getY() - j));
                result.add(new Cell(start.getX() + i + centerWidth - 1, start.getY() + j + centerHeight - 1));
            }
        }
        for (int i = 0; i < centerWidth; i++) {
            for (int j = 1; j <= radius; j++) {
                result.add(new Cell(start.getX() + i, start.getY() - j));
                result.add(new Cell(start.getX() + i, start.getY() + j + centerHeight - 1));
            }
        }
        for (int i = 0; i < centerHeight; i++) {
            for (int j = 1; j <= radius; j++) {
                result.add(new Cell(start.getX() - j, start.getY() + i));
                result.add(new Cell(start.getX() + j + centerWidth - 1, start.getY() + i));
            }
        }
        result.removeIf(c -> !c.isInBorders(map.getSize()) || !filter.test(c));
        return result;
    }

    @NonNull
    private List<Cell> findNeighborsInRadius(@NonNull Cell start, int radius, @NonNull Predicate<Cell> filter) {
        return findNeighborsInRadius(start, 1, 1, radius, filter);
    }

    @NonNull
    private List<Cell> findCellsInBetween(@NonNull Cell firstCell, @NonNull Cell lastCell) {
        final int dx = lastCell.getX() - firstCell.getX(), dy = lastCell.getY() - firstCell.getY();
        if (dx > -2 && dx < 2 && dy > -2 && dy < 2) {
            final List<Cell> result = new ArrayList<>(2);
            result.add(firstCell);
            result.add(lastCell);
            return result;
        }

        final Point<Float> center = firstCell.findCenter(lastCell);
        final Cell firstCenterCell = new Cell(), secondCenterCell = new Cell();
        if (center.getX() == Math.floor(center.getX())) {
            firstCenterCell.setX(center.getX().intValue());
            secondCenterCell.setX(firstCenterCell.getX());
        } else {
            if (firstCell.getX() < lastCell.getX()) {
                firstCenterCell.setX((int) Math.floor(center.getX()));
                secondCenterCell.setX(firstCenterCell.getX() + 1);
            } else {
                firstCenterCell.setX((int) Math.ceil(center.getX()));
                secondCenterCell.setX(firstCenterCell.getX() - 1);
            }
        }
        if (center.getY() == Math.floor(center.getY())) {
            firstCenterCell.setY(center.getY().intValue());
            secondCenterCell.setY(firstCenterCell.getY());
        } else {
            if (firstCell.getY() < lastCell.getY()) {
                firstCenterCell.setY((int) Math.floor(center.getY()));
                secondCenterCell.setY(firstCenterCell.getY() + 1);
            } else {
                firstCenterCell.setY((int) Math.ceil(center.getY()));
                secondCenterCell.setY(firstCenterCell.getY() - 1);
            }
        }

        final List<Cell> result = findCellsInBetween(firstCell, firstCenterCell);
        final int firstCellIndexWithOffset = result.size() - 2;
        if (!firstCenterCell.equals(secondCenterCell)) {
            result.add(secondCenterCell);
        }
        Cell nextCell = new Cell(secondCenterCell);
        for (int i = firstCellIndexWithOffset; i > -1; i--) {
            nextCell.setX(nextCell.getX() + result.get(i + 1).getX() - result.get(i).getX());
            nextCell.setY(nextCell.getY() + result.get(i + 1).getY() - result.get(i).getY());
            result.add(nextCell);
            nextCell = new Cell(nextCell);
        }
        return result;
    }

    private void generateEnvironment() {
        for (int i = getSize().getX() / 3; i < getSize().getX() * 2 / 3; i++) {
            for (int j = 0; j < getSize().getY(); j++) {
                final int randomInt = ThreadLocalRandom.current().nextInt(0, 4);
                if (randomInt == 0) {
                    if (asteroids.size() < getSize().getY()) {
                        final Cell asteroid = new Cell(i, j);
                        asteroids.add(asteroid);
                        map.createLocation(asteroid, LocationStatus.ASTEROID);
                    }
                } else if (randomInt == 1) {
                    final Cell cloud = new Cell(i, j);
                    clouds.add(cloud);
                    map.createLocation(cloud, LocationStatus.CLOUD);
                }
            }
        }
    }
}
