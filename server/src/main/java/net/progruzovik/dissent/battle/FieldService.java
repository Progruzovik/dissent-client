package net.progruzovik.dissent.battle;

import net.progruzovik.dissent.model.Gun;
import net.progruzovik.dissent.model.Ship;
import net.progruzovik.dissent.model.Unit;
import net.progruzovik.dissent.player.Player;
import net.progruzovik.dissent.util.Point;

import java.util.*;
import java.util.function.Predicate;

public final class FieldService implements Field {

    private static final int UNIT_INDENT = 3;
    private static final int BORDER_INDENT = 4;

    private final Point size;
    private int turnNumber = 0;

    private final Player leftPlayer;
    private final Player rightPlayer;

    private final List<List<Point>> currentPaths;

    private final List<List<CellStatus>> map;
    private final List<Point> asteroids = new ArrayList<>();
    private final Queue<Unit> unitQueue = new LinkedList<>();

    private final Set<Ship> uniqueShips = new HashSet<>();
    private final Set<Gun> uniqueGuns = new HashSet<>();

    public FieldService(Player leftPlayer, Player rightPlayer) {
        final int unitsCount = Math.max(leftPlayer.getUnits().size(), rightPlayer.getUnits().size());
        final int colsCount = unitsCount * UNIT_INDENT + BORDER_INDENT * 2;
        size = new Point(colsCount, colsCount);
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
        asteroids.add(new Point(3, 2));
        asteroids.add(new Point(3, 3));
        asteroids.add(new Point(3, 4));
        asteroids.add(new Point(4, 3));
        asteroids.add(new Point(4, 4));
        for (final Point asteroid : asteroids) {
            map.get(asteroid.getX()).set(asteroid.getY(), CellStatus.OBSTACLE);
        }

        int i = 0;
        for (final Unit unit : leftPlayer.getUnits()) {
            unit.init(Side.LEFT, new Point(0, i * UNIT_INDENT + BORDER_INDENT));
            registerUnit(unit);
            i++;
        }
        this.leftPlayer = leftPlayer;
        i = 0;
        for (final Unit unit : rightPlayer.getUnits()) {
            unit.init(Side.RIGHT, new Point(colsCount - 1, i * UNIT_INDENT + BORDER_INDENT));
            registerUnit(unit);
            i++;
        }
        this.rightPlayer = rightPlayer;
        onNextTurn();
    }

    @Override
    public Point getSize() {
        return size;
    }

    @Override
    public int getTurnNumber() {
        return turnNumber;
    }

    @Override
    public List<List<Point>> getCurrentPaths() {
        return currentPaths;
    }

    @Override
    public List<Point> getCurrentReachableCells() {
        return findNeighborsInRadius(getCurrentUnit().getCell(),
                getCurrentUnit().getMovementPoints(), c -> !checkCellReachable(c));
    }

    @Override
    public List<Point> getAsteroids() {
        return asteroids;
    }

    @Override
    public Unit getCurrentUnit() {
        return unitQueue.element();
    }

    @Override
    public Queue<Unit> getUnitQueue() {
        return unitQueue;
    }

    @Override
    public Set<Ship> getUniqueShips() {
        return uniqueShips;
    }

    @Override
    public Set<Gun> getUniqueGuns() {
        return uniqueGuns;
    }

    @Override
    public Side getPlayerSide(Player player) {
        if (player == leftPlayer) {
            return Side.LEFT;
        }
        if (player == rightPlayer) {
            return Side.RIGHT;
        }
        return Side.NONE;
    }

    @Override
    public boolean moveCurrentUnit(Player player, Point cell) {
        if (player == getCurrentPlayer() && cell.checkInBorders(size) && checkCellReachable(cell)) {
            final Point oldCell = getCurrentUnit().getCell();
            if (getCurrentUnit().move(cell)) {
                map.get(oldCell.getX()).set(oldCell.getY(), CellStatus.EMPTY);
                map.get(cell.getX()).set(cell.getY(), CellStatus.UNIT);
                createPathsForCurrentUnit();
                return true;
            }
        }
        return false;
    }

    @Override
    public boolean nextTurn(Player player) {
        if (player == getCurrentPlayer()) {
            turnNumber++;
            unitQueue.offer(unitQueue.poll());
            while (player != getCurrentPlayer()) {
                turnNumber++;
                unitQueue.offer(unitQueue.poll());
            }
            onNextTurn();
            return true;
        }
        return false;
    }

    private boolean checkCellReachable(Point cell) {
        return currentPaths.get(cell.getX()).get(cell.getY()) != null
                && map.get(cell.getX()).get(cell.getY()) == CellStatus.EMPTY;
    }

    private Player getCurrentPlayer() {
        switch (getCurrentUnit().getSide()) {
            case LEFT: return leftPlayer;
            case RIGHT: return rightPlayer;
            default: return null;
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

    private void registerUnit(Unit unit) {
        map.get(unit.getCell().getX()).set(unit.getCell().getY(), CellStatus.UNIT);
        unitQueue.offer(unit);
        uniqueShips.add(unit.getShip());
        if (unit.getFirstGun() != null) {
            uniqueGuns.add(unit.getFirstGun());
        }
        if (unit.getSecondGun() != null) {
            uniqueGuns.add(unit.getSecondGun());
        }
    }

    private void onNextTurn() {
        getCurrentUnit().makeCurrent();
        createPathsForCurrentUnit();
    }

    private void createPathsForCurrentUnit() {
        final List<List<Integer>> distances = new ArrayList<>(size.getX());
        for (int i = 0; i < size.getX(); i++) {
            distances.add(new ArrayList<>(size.getY()));
            for (int j = 0; j < size.getY(); j++) {
                distances.get(i).add(Integer.MAX_VALUE);
                currentPaths.get(i).set(j, null);
            }
        }
        final Point unitCell = getCurrentUnit().getCell();
        distances.get(unitCell.getX()).set(unitCell.getY(), 0);
        currentPaths.get(unitCell.getX()).set(unitCell.getY(), unitCell);

        final Queue<Point> cellQueue = new LinkedList<>();
        cellQueue.offer(unitCell);
        while (!cellQueue.isEmpty()) {
            final Point cell = cellQueue.poll();
            final int distanceToCell = distances.get(cell.getX()).get(cell.getY());
            if (distanceToCell < getCurrentUnit().getMovementPoints()) {
                for (final Point neighborCell : findNeighborsForCell(cell)) {
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
}
