package net.progruzovik.dissent.model;

import net.progruzovik.dissent.battle.CellStatus;
import net.progruzovik.dissent.model.util.Cell;

import java.util.*;
import java.util.function.Predicate;

public final class Field {

    private final Cell size;

    private final List<List<Cell>> paths;

    private final List<List<CellStatus>> map;
    private final List<Cell> asteroids = new ArrayList<>();

    public Field(Cell size) {
        this.size = size;
        paths = new ArrayList<>(size.getX());
        map = new ArrayList<>(size.getX());
        for (int i = 0; i < size.getX(); i++) {
            paths.add(new ArrayList<>(size.getY()));
            map.add(new ArrayList<>(size.getY()));
            for (int j = 0; j < size.getY(); j++) {
                paths.get(i).add(null);
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

    public List<List<Cell>> getPaths() {
        return paths;
    }

    public List<Cell> getAsteroids() {
        return asteroids;
    }

    public boolean checkCellReachable(Cell cell) {
        return paths.get(cell.getX()).get(cell.getY()) != null
                && map.get(cell.getX()).get(cell.getY()) == CellStatus.EMPTY;
    }

    public List<Cell> findReachableCellsForUnit(Unit unit) {
        return findNeighborsInRadius(unit.getCell(), unit.getMovementPoints(), c -> !checkCellReachable(c));
    }

    public List<Cell> findCellsForShot(Cell startCell, int radius) {
        return findNeighborsInRadius(startCell, radius, c -> {
            final List<Cell> cellsInBetween = findCellsInBetween(startCell, c);
            for (int i = 1; i < cellsInBetween.size(); i++) {
                if (map.get(cellsInBetween.get(i).getX()).get(cellsInBetween.get(i).getY()) != CellStatus.EMPTY) {
                    return true;
                }
            }
            return false;
        });
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
                paths.get(i).set(j, null);
            }
        }
        final Cell unitCell = unit.getCell();
        distances.get(unitCell.getX()).set(unitCell.getY(), 0);
        paths.get(unitCell.getX()).set(unitCell.getY(), unitCell);

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
                        paths.get(neighborCell.getX()).set(neighborCell.getY(), cell);
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
        result.removeIf(c -> !c.checkInBorders(size) || removeIf.test(c));
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

        final Cell firstCenterCell = new Cell(), secondCenterCell = new Cell();
        final float centerX = firstCell.findCenterX(lastCell.getX());
        if (centerX == Math.floor(centerX)) {
            firstCenterCell.setX((int) centerX);
            secondCenterCell.setX(firstCenterCell.getX());
        } else {
            if (firstCell.getX() < lastCell.getX()) {
                firstCenterCell.setX((int) Math.floor(centerX));
                secondCenterCell.setX(firstCenterCell.getX() + 1);
            } else {
                firstCenterCell.setX((int) Math.ceil(centerX));
                secondCenterCell.setX(firstCenterCell.getX() - 1);
            }
        }
        final double centerY = firstCell.findCenterY(lastCell.getY());
        if (centerY == Math.floor(centerY)) {
            firstCenterCell.setY((int) centerY);
            secondCenterCell.setY(firstCenterCell.getY());
        } else {
            if (firstCell.getY() < lastCell.getY()) {
                firstCenterCell.setY((int) Math.floor(centerY));
                secondCenterCell.setY(firstCenterCell.getY() + 1);
            } else {
                firstCenterCell.setY((int) Math.ceil(centerY));
                secondCenterCell.setY(firstCenterCell.getY() - 1);
            }
        }

        final List<Cell> result = findCellsInBetween(firstCell, firstCenterCell);
        final int firstCellIndexWithOffset = result.size() - 2;
        if (!firstCenterCell.isSame(secondCenterCell)) {
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
