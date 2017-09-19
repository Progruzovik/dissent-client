package net.progruzovik.dissent.model;

import net.progruzovik.dissent.battle.CellStatus;
import net.progruzovik.dissent.model.util.Point;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Queue;
import java.util.function.Predicate;

public final class Field {

    private final Point size;

    private final List<List<Point>> paths;

    private final List<List<CellStatus>> map;
    private final List<Point> asteroids = new ArrayList<>();

    public Field(Point size) {
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

        asteroids.add(new Point(3, 2));
        asteroids.add(new Point(3, 3));
        asteroids.add(new Point(3, 4));
        asteroids.add(new Point(4, 3));
        asteroids.add(new Point(4, 4));
        for (final Point asteroid : asteroids) {
            map.get(asteroid.getX()).set(asteroid.getY(), CellStatus.OBSTACLE);
        }
    }

    public Point getSize() {
        return size;
    }

    public List<List<Point>> getPaths() {
        return paths;
    }

    public List<Point> getAsteroids() {
        return asteroids;
    }

    public boolean checkCellReachable(Point cell) {
        return paths.get(cell.getX()).get(cell.getY()) != null
                && map.get(cell.getX()).get(cell.getY()) == CellStatus.EMPTY;
    }

    public List<Point> getReachableCellsForUnit(Unit unit) {
        return findNeighborsInRadius(unit.getCell(), unit.getMovementPoints(), c -> !checkCellReachable(c));
    }

    public void addUnit(Point cell) {
        map.get(cell.getX()).set(cell.getY(), CellStatus.UNIT);
    }

    public void moveUnit(Point oldCell, Point newCell) {
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
        final Point unitCell = unit.getCell();
        distances.get(unitCell.getX()).set(unitCell.getY(), 0);
        paths.get(unitCell.getX()).set(unitCell.getY(), unitCell);

        final Queue<Point> cellQueue = new LinkedList<>();
        cellQueue.offer(unitCell);
        while (!cellQueue.isEmpty()) {
            final Point cell = cellQueue.poll();
            final int distanceToCell = distances.get(cell.getX()).get(cell.getY());
            if (distanceToCell < unit.getMovementPoints()) {
                for (final Point neighborCell : findNeighborsForCell(cell)) {
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

    private List<Point> findNeighborsForCell(Point cell) {
        return findNeighborsInRadius(cell, 1, c -> false);
    }

    private List<Point> findNeighborsInRadius(Point cell, int radius, Predicate<Point> removeIf) {
        final List<Point> result = new ArrayList<>();
        for (int i = 0; i < radius; i++) {
            for (int j = 1; j <= radius - i; j++) {
                result.add(new Point(cell.getX() + i, cell.getY() - j));
                result.add(new Point(cell.getX() - i, cell.getY() + j));
                result.add(new Point(cell.getX() + j, cell.getY() + i));
                result.add(new Point(cell.getX() - j, cell.getY() - i));
            }
        }
        result.removeIf(c -> !c.checkInBorders(size) || removeIf.test(c));
        return result;
    }
}
