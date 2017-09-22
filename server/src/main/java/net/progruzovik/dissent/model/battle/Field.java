package net.progruzovik.dissent.model.battle;

import net.progruzovik.dissent.battle.CellStatus;
import net.progruzovik.dissent.model.Unit;
import net.progruzovik.dissent.model.util.Cell;
import net.progruzovik.dissent.model.util.Point;

import java.util.*;
import java.util.function.Predicate;

public final class Field {

    private final Cell size;

    private final List<List<Cell>> currentPaths;
    private final List<Cell> currentTargets = new ArrayList<>();

    private final List<List<CellStatus>> map;
    private final List<Cell> asteroids = new ArrayList<>();

    public Field(Cell size) {
        this.size = size;
        currentPaths = new ArrayList<>(size.getX());
        map = new ArrayList<>(size.getX());
        for (int i = 0; i < size.getX(); i++) {
            currentPaths.add(new ArrayList<>(size.getY()));
            map.add(new ArrayList<>(size.getY()));
            for (int j = 0; j < size.getY(); j++) {
                currentPaths.get(i).add(null);
                map.get(i).add(CellStatus.EMPTY);
            }
        }

        asteroids.add(new Cell(3, 2));
        asteroids.add(new Cell(3, 3));
        asteroids.add(new Cell(3, 4));
        asteroids.add(new Cell(4, 3));
        asteroids.add(new Cell(4, 4));
        for (final Cell asteroid : asteroids) {
            map.get(asteroid.getX()).set(asteroid.getY(), CellStatus.OBSTACLE);
        }
    }

    public Cell getSize() {
        return size;
    }

    public List<List<Cell>> getCurrentPaths() {
        return currentPaths;
    }

    public List<Cell> getAsteroids() {
        return asteroids;
    }

    public boolean isCellInCurrentPaths(Cell cell) {
        return currentPaths.get(cell.getX()).get(cell.getY()) != null
                && map.get(cell.getX()).get(cell.getY()) == CellStatus.EMPTY;
    }

    public boolean isCellInCurrentTargets(Cell cell) {
        return currentTargets.contains(cell);
    }

    public List<Cell> findReachableCellsForUnit(Unit unit) {
        return findNeighborsInRadius(unit.getCell(), unit.getMovementPoints(), c -> !isCellInCurrentPaths(c));
    }

    public Map<String, List<Cell>> findShotAndTargetCells(Cell startCell, int radius) {
        Map<String, List<Cell>> result = new HashMap<>(2);
        List<Cell> availableCells = findNeighborsInRadius(startCell, radius, c -> {
            final List<Cell> cellsInBetween = findCellsInBetween(startCell, c);
            for (int i = 1; i < cellsInBetween.size() - 1; i++) {
                if (map.get(cellsInBetween.get(i).getX()).get(cellsInBetween.get(i).getY()) != CellStatus.EMPTY) {
                    return true;
                }
            }
            return false;
        });

        List<Cell> shotCells = new ArrayList<>();
        currentTargets.clear();
        for (final Cell cell : availableCells) {
            if (map.get(cell.getX()).get(cell.getY()) == CellStatus.EMPTY) {
                shotCells.add(cell);
            }  else if (map.get(cell.getX()).get(cell.getY()) == CellStatus.UNIT) {
                currentTargets.add(cell);
            }
        }
        result.put("shotCells", shotCells);
        result.put("targetCells", currentTargets);
        return result;
    }

    public void addUnit(Cell cell) {
        map.get(cell.getX()).set(cell.getY(), CellStatus.UNIT);
    }

    public void moveUnit(Cell oldCell, Cell newCell) {
        map.get(oldCell.getX()).set(oldCell.getY(), CellStatus.EMPTY);
        map.get(newCell.getX()).set(newCell.getY(), CellStatus.UNIT);
    }

    public void createPathsForUnit(Unit unit) {
        final List<List<Integer>> distances = new ArrayList<>(size.getX());
        for (int i = 0; i < size.getX(); i++) {
            distances.add(new ArrayList<>(size.getY()));
            for (int j = 0; j < size.getY(); j++) {
                distances.get(i).add(Integer.MAX_VALUE);
                currentPaths.get(i).set(j, null);
            }
        }
        final Cell unitCell = unit.getCell();
        distances.get(unitCell.getX()).set(unitCell.getY(), 0);
        currentPaths.get(unitCell.getX()).set(unitCell.getY(), unitCell);

        final Queue<Cell> cellQueue = new LinkedList<>();
        cellQueue.offer(unitCell);
        while (!cellQueue.isEmpty()) {
            final Cell cell = cellQueue.poll();
            final int distanceToCell = distances.get(cell.getX()).get(cell.getY());
            if (distanceToCell < unit.getMovementPoints()) {
                for (final Cell neighborCell : findNeighborsForCell(cell)) {
                    final CellStatus neighborStatus = map.get(neighborCell.getX()).get(neighborCell.getY());
                    if (neighborStatus != CellStatus.OBSTACLE
                            && distances.get(neighborCell.getX()).get(neighborCell.getY()) > distanceToCell + 1) {
                        distances.get(neighborCell.getX()).set(neighborCell.getY(), distanceToCell + 1);
                        currentPaths.get(neighborCell.getX()).set(neighborCell.getY(), cell);
                        cellQueue.offer(neighborCell);
                    }
                }
            }
        }
    }

    private List<Cell> findNeighborsForCell(Cell cell) {
        return findNeighborsInRadius(cell, 1, c -> false);
    }

    private List<Cell> findNeighborsInRadius(Cell cell, int radius, Predicate<Cell> removeIf) {
        final List<Cell> result = new ArrayList<>();
        for (int i = 0; i < radius; i++) {
            for (int j = 1; j <= radius - i; j++) {
                result.add(new Cell(cell.getX() + i, cell.getY() - j));
                result.add(new Cell(cell.getX() - i, cell.getY() + j));
                result.add(new Cell(cell.getX() + j, cell.getY() + i));
                result.add(new Cell(cell.getX() - j, cell.getY() - i));
            }
        }
        result.removeIf(c -> !c.isInBorders(size) || removeIf.test(c));
        return result;
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
