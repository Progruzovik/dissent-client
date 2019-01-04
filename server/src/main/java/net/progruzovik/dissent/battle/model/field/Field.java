package net.progruzovik.dissent.battle.model.field;

import net.progruzovik.dissent.battle.exception.InvalidGunIdException;
import net.progruzovik.dissent.battle.exception.InvalidMoveException;
import net.progruzovik.dissent.battle.exception.InvalidUnitException;
import net.progruzovik.dissent.battle.model.Side;
import net.progruzovik.dissent.battle.model.Unit;
import net.progruzovik.dissent.battle.model.field.gun.GunCells;
import net.progruzovik.dissent.battle.model.field.gun.Target;
import net.progruzovik.dissent.battle.model.field.location.LocationStatus;
import net.progruzovik.dissent.battle.model.field.location.BattleMap;
import net.progruzovik.dissent.model.dto.MoveDto;
import net.progruzovik.dissent.battle.model.util.Cell;
import net.progruzovik.dissent.battle.model.util.Point;
import net.progruzovik.dissent.model.entity.Gun;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;

import java.util.*;
import java.util.concurrent.ThreadLocalRandom;

public final class Field {

    public static final int UNIT_INDENT = 2;
    public static final int BORDER_INDENT = 4;

    private final @NonNull BattleMap map;
    private final @NonNull List<Cell> asteroids = new ArrayList<>();
    private final @NonNull List<Cell> clouds = new ArrayList<>();
    private final @NonNull List<Unit> destroyedUnits = new ArrayList<>();

    private @Nullable Unit activeUnit = null;
    private int preparedGunId = Gun.NO_GUN_ID;
    private final @NonNull List<List<PathNode>> paths;
    private final @NonNull List<Cell> reachableCells = new ArrayList<>();
    private final @NonNull GunCells gunCells = new GunCells();

    public Field(@NonNull Cell size) {
        map = new BattleMap(size);
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

    public double findHittingChance(int gunId, @NonNull Cell cell) {
        if (preparedGunId != gunId) throw new InvalidGunIdException(gunId);
        return gunCells.getTargets().stream()
                .filter(t -> t.getCell().equals(cell))
                .findFirst()
                .map(Target::getHittingChance)
                .orElse(0.0);
    }

    public void addUnit(@NonNull Unit unit) {
        map.addUnit(unit);
    }

    public void updateActiveUnit() {
        preparedGunId = Gun.NO_GUN_ID;
        updatePaths();
        updateReachableCells();
        gunCells.clear();
    }

    public void resetActiveUnit() {
        activeUnit = null;
        updateActiveUnit();
    }

    @NonNull
    public MoveDto moveActiveUnit(@NonNull Cell cell) {
        assert activeUnit != null;
        if (!map.isCellInBorders(cell) || isCellUnreachable(cell)) {
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
        return new MoveDto(movementCost, cells);
    }

    @NonNull
    public GunCells getGunCells(int gunId) {
        if (preparedGunId != gunId) {
            preparedGunId = gunId;
            gunCells.clear();
            if (activeUnit != null) {
                final Cell unitCell = activeUnit.getFirstCell();
                final Gun gun = activeUnit.getShip().findGunById(gunId);
                final List<Cell> neighbors = findNeighborsInRadius(activeUnit.getFirstCell(),
                        activeUnit.getWidth(), activeUnit.getHeight(), gun.getRadius());
                final LocationStatus targetStatus = activeUnit.getLocationStatus() == LocationStatus.UNIT_LEFT
                        ? LocationStatus.UNIT_RIGHT : LocationStatus.UNIT_LEFT;
                for (final Cell neighbor : neighbors) {
                    double maxHittingChance = 0;
                    for (int i = 0; i < activeUnit.getWidth(); i++) {
                        for (int j = 0; j < activeUnit.getHeight(); j++) {
                            final Cell cell = new Cell(unitCell.getX() + i, unitCell.getY() + j);
                            final double hittingChance = findHittingChance(cell, neighbor, gun);
                            if (hittingChance > maxHittingChance) {
                                maxHittingChance = hittingChance;
                            }
                        }
                    }
                    if (maxHittingChance != 0) {
                        final LocationStatus locationStatus = map.getLocationStatus(neighbor);
                        if (locationStatus == targetStatus) {
                            gunCells.getTargets().add(new Target(neighbor, maxHittingChance));
                        } else if (locationStatus.isFree()) {
                            gunCells.getShotCells().add(neighbor);
                        }
                    }
                }
            }
        }
        return gunCells;
    }

    public void destroyUnit(@NonNull Unit unit) {
        destroyedUnits.add(unit);
        map.destroyUnit(unit);
        gunCells.getTargets().removeIf(t -> t.getCell().equals(unit.getFirstCell()));
    }

    private boolean isCellUnreachable(@NonNull Cell cell) {
        if (paths.get(cell.getX()).get(cell.getY()) == null) return true;
        assert activeUnit != null;
        for (int i = 0; i < activeUnit.getWidth(); i++) {
            for (int j = 0; j < activeUnit.getHeight(); j++) {
                final Cell nextCell = new Cell(cell.getX() + i, cell.getY() + j);
                if (!map.isCellInBorders(nextCell)
                        || !map.getLocationStatus(nextCell).isFree() && !activeUnit.isOccupyCell(nextCell)) {
                    return true;
                }
            }
        }
        return false;
    }

    private double findHittingChance(@NonNull Cell from, @NonNull Cell target, @NonNull Gun gun) {
        assert activeUnit != null;
        int cloudsCount = 0;
        for (final Cell cell : findCellsInBetween(from, target)) {
            final LocationStatus status = map.getLocationStatus(cell);
            if (!status.isFree() && !activeUnit.isOccupyCell(cell) && !target.equals(cell)) return 0;
            if (status == LocationStatus.CLOUD) {
                cloudsCount++;
            }
        }
        final double distanceToTarget = from.distanceTo(target);
        final double chanceToMiss = (1 - gun.getAccuracy()) * (distanceToTarget + cloudsCount) / gun.getRadius();
        return chanceToMiss < 1 ? 1 - chanceToMiss : 0;
    }

    @NonNull
    private List<Cell> findNeighborsForCell(@NonNull Cell cell) {
        return findNeighborsInRadius(cell, 1);
    }

    @NonNull
    private List<Cell> findNeighborsInRadius(@NonNull Cell start, int centerWidth, int centerHeight, int radius) {
        final List<Cell> neighbors = new ArrayList<>();
        for (int i = 1; i <= radius; i++) {
            for (int j = 1; j <= radius - i; j++) {
                neighbors.add(new Cell(start.getX() - i, start.getY() - j));
                neighbors.add(new Cell(start.getX() - i, start.getY() + j + centerHeight  - 1));
                neighbors.add(new Cell(start.getX() + i + centerWidth - 1, start.getY() - j));
                neighbors.add(new Cell(start.getX() + i + centerWidth - 1, start.getY() + j + centerHeight - 1));
            }
        }
        for (int i = 0; i < centerWidth; i++) {
            for (int j = 1; j <= radius; j++) {
                neighbors.add(new Cell(start.getX() + i, start.getY() - j));
                neighbors.add(new Cell(start.getX() + i, start.getY() + j + centerHeight - 1));
            }
        }
        for (int i = 0; i < centerHeight; i++) {
            for (int j = 1; j <= radius; j++) {
                neighbors.add(new Cell(start.getX() - j, start.getY() + i));
                neighbors.add(new Cell(start.getX() + j + centerWidth - 1, start.getY() + i));
            }
        }
        neighbors.removeIf(c -> !map.isCellInBorders(c));
        return neighbors;
    }

    @NonNull
    private List<Cell> findNeighborsInRadius(@NonNull Cell start, int radius) {
        return findNeighborsInRadius(start, 1, 1, radius);
    }

    @NonNull
    private List<Cell> findCellsInBetween(@NonNull Cell firstCell, @NonNull Cell lastCell) {
        final int dx = lastCell.getX() - firstCell.getX(), dy = lastCell.getY() - firstCell.getY();
        if (dx > -2 && dx < 2 && dy > -2 && dy < 2) {
            final List<Cell> cells = new ArrayList<>(2);
            cells.add(firstCell);
            cells.add(lastCell);
            return cells;
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

        final List<Cell> cellsInBetween = findCellsInBetween(firstCell, firstCenterCell);
        final int firstCellIndexWithOffset = cellsInBetween.size() - 2;
        if (!firstCenterCell.equals(secondCenterCell)) {
            cellsInBetween.add(secondCenterCell);
        }
        Cell nextCell = new Cell(secondCenterCell);
        for (int i = firstCellIndexWithOffset; i > -1; i--) {
            nextCell.setX(nextCell.getX() + cellsInBetween.get(i + 1).getX() - cellsInBetween.get(i).getX());
            nextCell.setY(nextCell.getY() + cellsInBetween.get(i + 1).getY() - cellsInBetween.get(i).getY());
            cellsInBetween.add(nextCell);
            nextCell = new Cell(nextCell);
        }
        return cellsInBetween;
    }

    private void generateEnvironment() {
        generateAsteroids();
        for (int i = getSize().getX() / 4; i < getSize().getX() * 3 / 4; i++) {
            for (int j = 0; j < getSize().getY(); j++) {
                if (map.getLocationStatus(i, j) != LocationStatus.ASTEROID) {
                    if (ThreadLocalRandom.current().nextInt(0, 4) == 0) {
                        final Cell cloud = new Cell(i, j);
                        clouds.add(cloud);
                        map.createLocation(cloud, LocationStatus.CLOUD);
                    }
                }
            }
        }
    }

    private void generateAsteroids() {
        for (int i = getSize().getX() / 3; i < getSize().getX() * 2 / 3; i++) {
            for (int j = 0; j < getSize().getY(); j++) {
                if (ThreadLocalRandom.current().nextInt(0, getSize().getX() / 3) == 0) {
                    final Cell asteroid = new Cell(i, j);
                    asteroids.add(asteroid);
                    map.createLocation(asteroid, LocationStatus.ASTEROID);
                    if (asteroids.size() == getSize().getY() - 1) return;
                }
            }
        }
    }

    private void updatePaths() {
        for (final List<PathNode> currentPath : paths) {
            for (int j = 0; j < currentPath.size(); j++) {
                currentPath.set(j, null);
            }
        }
        if (activeUnit != null) {
            final int width = activeUnit.getWidth(), height = activeUnit.getHeight();
            final PathNode firstNode = new PathNode(0, activeUnit.getFirstCell());
            paths.get(activeUnit.getFirstCell().getX()).set(activeUnit.getFirstCell().getY(), firstNode);
            final Queue<Cell> cellQueue = new LinkedList<>();
            cellQueue.offer(activeUnit.getFirstCell());
            while (!cellQueue.isEmpty()) {
                final Cell cell = cellQueue.remove();
                final int movementCost = paths.get(cell.getX()).get(cell.getY()).getMovementCost();
                for (final Cell neighbor : findNeighborsForCell(cell)) {
                    final int neighborCost = movementCost + map.findMovementCost(neighbor, width, height);
                    final PathNode pathFromNeighbor = paths.get(neighbor.getX()).get(neighbor.getY());
                    if (neighborCost <= activeUnit.getActionPoints()
                            && (pathFromNeighbor == null || pathFromNeighbor.getMovementCost() > neighborCost)) {
                        paths.get(neighbor.getX()).set(neighbor.getY(), new PathNode(neighborCost, cell));
                        cellQueue.offer(neighbor);
                    }
                }
            }
        }
    }

    private void updateReachableCells() {
        reachableCells.clear();
        if (activeUnit != null) {
            reachableCells.addAll(findNeighborsInRadius(activeUnit.getFirstCell(), activeUnit.getActionPoints()));
            reachableCells.removeIf(this::isCellUnreachable);
        }
    }
}
