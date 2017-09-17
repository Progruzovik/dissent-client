package net.progruzovik.dissent.battle;

import net.progruzovik.dissent.model.Gun;
import net.progruzovik.dissent.model.Ship;
import net.progruzovik.dissent.model.Unit;
import net.progruzovik.dissent.player.Player;
import net.progruzovik.dissent.util.Point;

import java.util.*;

public final class FieldService implements Field {

    private static final int UNIT_INDENT = 3;
    private static final int BORDER_INDENT = 4;

    private final Point size;
    private int turnNumber = 0;

    private final Player leftPlayer;
    private final Player rightPlayer;

    private final List<List<Point>> paths;

    private final List<List<CellStatus>> map;
    private final List<Point> asteroids = new ArrayList<>();
    private final Queue<Unit> unitQueue = new LinkedList<>();

    private final Set<Ship> uniqueShips = new HashSet<>();
    private final Set<Gun> uniqueGuns = new HashSet<>();

    public FieldService(Player leftPlayer, Player rightPlayer) {
        final int unitsCount = Math.max(leftPlayer.getUnits().size(), rightPlayer.getUnits().size());
        final int colsCount = unitsCount * UNIT_INDENT + BORDER_INDENT * 2;
        size = new Point(colsCount, colsCount);
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

        int i = 0;
        for (final Unit unit : leftPlayer.getUnits()) {
            unit.setSide(Side.LEFT);
            unit.setCell(new Point(0, i * UNIT_INDENT + BORDER_INDENT));
            registerUnit(unit);
            i++;
        }
        this.leftPlayer = leftPlayer;
        i = 0;
        for (final Unit unit : rightPlayer.getUnits()) {
            unit.setSide(Side.RIGHT);
            unit.setCell(new Point(colsCount - 1, i * UNIT_INDENT + BORDER_INDENT));
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
    public List<List<Point>> getPaths() {
        return paths;
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
        if (player == getCurrentPlayer() && cell.getX() > -1 && cell.getX() < size.getX()
                && cell.getY() > -1 && cell.getY() < size.getY()) {
            getCurrentUnit().setCell(cell);
            createPathsForCurrentUnit();
            return true;
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

    private Player getCurrentPlayer() {
        switch (getCurrentUnit().getSide()) {
            case LEFT: return leftPlayer;
            case RIGHT: return rightPlayer;
            default: return null;
        }
    }

    private List<Point> findNeighborsForCell(Point cell) {
        final List<Point> result = new ArrayList<>();
        result.add(new Point(cell.getX(), cell.getY() - 1));
        result.add(new Point(cell.getX(), cell.getY() + 1));
        result.add(new Point(cell.getX() + 1, cell.getY()));
        result.add(new Point(cell.getX() - 1, cell.getY()));
        result.removeIf(neighborCell -> neighborCell.getX() < 0 || neighborCell.getX() >= size.getX()
                || neighborCell.getY() < 0 || neighborCell.getY() >= size.getY());
        return result;
    }

    private void registerUnit(Unit unit) {
        map.get(unit.getCell().getX()).set(unit.getCell().getY(), CellStatus.SHIP);
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
                paths.get(i).set(j, null);
            }
        }
        final Point unitCell = new Point(getCurrentUnit().getCell());
        distances.get(unitCell.getX()).set(unitCell.getY(), 0);
        paths.get(unitCell.getX()).set(unitCell.getY(), unitCell);

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
                        paths.get(neighborCell.getX()).set(neighborCell.getY(), cell);
                        cellQueue.offer(neighborCell);
                    }
                }
            }
        }
    }
}
