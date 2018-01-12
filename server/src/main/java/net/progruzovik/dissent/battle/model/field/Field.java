package net.progruzovik.dissent.battle.model.field;

import net.progruzovik.dissent.battle.model.Side;
import net.progruzovik.dissent.battle.model.Unit;
import net.progruzovik.dissent.exception.InvalidMoveException;
import net.progruzovik.dissent.exception.InvalidUnitException;
import net.progruzovik.dissent.model.entity.Gun;
import net.progruzovik.dissent.model.util.Cell;
import net.progruzovik.dissent.model.util.Point;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Queue;
import java.util.function.Predicate;

public final class Field {

    public static final int UNIT_INDENT = 3;
    public static final int BORDER_INDENT = 4;

    private final Map map;
    private final List<Cell> asteroids = new ArrayList<>();
    private final List<Cell> clouds = new ArrayList<>();
    private final List<Unit> destroyedUnits = new ArrayList<>();

    private Unit activeUnit = null;
    private int preparedGunId = Gun.NO_GUN_ID;
    private final List<List<PathNode>> paths;
    private List<Cell> reachableCells = null;
    private final GunCells gunCells = new GunCells();

    public Field(Cell size) {
        map = new Map(size);
        paths = new ArrayList<>(size.getX());
        for (int i = 0; i < size.getX(); i++) {
            paths.add(new ArrayList<>(size.getY()));
            for (int j = 0; j < size.getY(); j++) {
                paths.get(i).add(null);
            }
        }

        asteroids.add(new Cell(5, 3));
        asteroids.add(new Cell(5, 4));
        asteroids.add(new Cell(5, 5));
        asteroids.add(new Cell(6, 4));
        asteroids.add(new Cell(6, 5));
        for (final Cell asteroid : asteroids) {
            map.createLocation(asteroid, LocationStatus.ASTEROID);
        }
        clouds.add(new Cell(getSize().getX() - 5, 3));
        clouds.add(new Cell(getSize().getX() - 5, 4));
        clouds.add(new Cell(getSize().getX() - 5, 5));
        clouds.add(new Cell(getSize().getX() - 6, 4));
        clouds.add(new Cell(getSize().getX() - 6, 5));
        for (final Cell cloud : clouds) {
            map.createLocation(cloud, LocationStatus.CLOUD);
        }
    }

    public Cell getSize() {
        return map.getSize();
    }

    public void setActiveUnit(Unit activeUnit) {
        final LocationStatus locationStatus = map.getLocationStatus(activeUnit.getFirstCell());
        if (activeUnit.getSide() == Side.NONE || locationStatus != activeUnit.getLocationStatus()) {
            throw new InvalidUnitException();
        }
        this.activeUnit = activeUnit;
        updateActiveUnit();
    }

    public List<Cell> getAsteroids() {
        return asteroids;
    }

    public List<Cell> getClouds() {
        return clouds;
    }

    public List<Unit> getDestroyedUnits() {
        return destroyedUnits;
    }

    public List<List<PathNode>> getPaths() {
        return paths;
    }

    public List<Cell> getReachableCells() {
        return reachableCells;
    }

    public boolean canActiveUnitHitCell(int gunId, Cell cell) {
        return preparedGunId == gunId && gunCells.getTargetCells().contains(cell);
    }

    public void addUnit(Unit unit) {
        map.addUnit(unit);
    }

    public void updateActiveUnit() {
        preparedGunId = Gun.NO_GUN_ID;
        for (final List<PathNode> currentPath : paths) {
            for (int j = 0; j < currentPath.size(); j++) {
                currentPath.set(j, null);
            }
        }

        final int width = activeUnit.getWidth(), height = activeUnit.getHeight();
        final PathNode firstNode = new PathNode(0, activeUnit.getFirstCell());
        paths.get(activeUnit.getFirstCell().getX()).set(activeUnit.getFirstCell().getY(), firstNode);
        final Queue<Cell> cellQueue = new LinkedList<>();
        cellQueue.offer(activeUnit.getFirstCell());
        while (!cellQueue.isEmpty()) {
            final Cell cell = cellQueue.poll();
            final int distanceToCell = paths.get(cell.getX()).get(cell.getY()).getMovementCost();
            for (final Cell neighborCell : findNeighborsForCell(cell)) {
                final int distanceToNeighbor = distanceToCell + map.findMovementCost(neighborCell, width, height);
                final PathNode pathFromNeighbor = paths.get(neighborCell.getX()).get(neighborCell.getY());
                if (distanceToNeighbor <= activeUnit.getActionPoints()
                        && (pathFromNeighbor == null || pathFromNeighbor.getMovementCost() > distanceToNeighbor)) {
                    paths.get(neighborCell.getX()).set(neighborCell.getY(), new PathNode(distanceToNeighbor, cell));
                    cellQueue.offer(neighborCell);
                }
            }
        }
        reachableCells = findNeighborsInRadius(activeUnit.getFirstCell(),
                activeUnit.getActionPoints(), this::isCellReachable);
    }

    public Move moveActiveUnit(Cell cell) {
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

    public GunCells getGunCells(int gunId) {
        if (preparedGunId != gunId) {
            preparedGunId = gunId;
            gunCells.clear();

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
        return gunCells;
    }

    public void destroyUnit(Unit unit) {
        destroyedUnits.add(unit);
        map.destroyUnit(unit);
        gunCells.getTargetCells().remove(unit.getFirstCell());
    }

    public void finish() {
        activeUnit = null;
        preparedGunId = Gun.NO_GUN_ID;
        paths.clear();
        reachableCells.clear();
        gunCells.clear();
    }

    private boolean isCellReachable(Cell cell) {
        if (paths.get(cell.getX()).get(cell.getY()) == null) return false;
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

    private boolean isCellCanBeShot(Cell from, Cell cell) {
        final List<Cell> cellsInBetween = findCellsInBetween(from, cell);
        for (int k = 1; k < cellsInBetween.size() - 1; k++) {
            final LocationStatus locationStatus = map.getLocationStatus(cellsInBetween.get(k));
            if (locationStatus != LocationStatus.EMPTY && !activeUnit.isOccupyCell(cellsInBetween.get(k))) {
                return false;
            }
        }
        return true;
    }

    private List<Cell> findNeighborsForCell(Cell cell) {
        return findNeighborsInRadius(cell, 1, c -> true);
    }

    private List<Cell> findNeighborsInRadius(Cell start, int centerWidth, int centerHeight,
                                             int radius, Predicate<Cell> filter) {
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

    private List<Cell> findNeighborsInRadius(Cell start, int radius, Predicate<Cell> filter) {
        return findNeighborsInRadius(start, 1, 1, radius, filter);
    }

    private List<Cell> findCellsInBetween(Cell firstCell, Cell lastCell) {
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
}
