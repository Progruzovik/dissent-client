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

    private final List<List<CellStatus>> map;
    private final List<Point> asteroids = new ArrayList<>();
    private final Queue<Unit> unitQueue = new LinkedList<>();

    private final Set<Ship> uniqueShips = new HashSet<>();
    private final Set<Gun> uniqueGuns = new HashSet<>();

    public FieldService(Player leftPlayer, Player rightPlayer) {
        final int unitsCount = Math.max(leftPlayer.getUnits().size(), rightPlayer.getUnits().size());
        final int colsCount = unitsCount * UNIT_INDENT + BORDER_INDENT * 2;
        size = new Point(colsCount, colsCount);
        map = new ArrayList<>(colsCount);
        for (int i = 0; i < colsCount; i++) {
            map.add(new ArrayList<>(colsCount));
            for (int j = 0; j < colsCount; j++) {
                map.get(i).add(CellStatus.Empty);
            }
        }
        asteroids.add(new Point(3, 2));
        asteroids.add(new Point(3, 3));
        asteroids.add(new Point(3, 4));
        asteroids.add(new Point(4, 3));
        asteroids.add(new Point(4, 4));
        for (final Point asteroid : asteroids) {
            map.get(asteroid.getX()).set(asteroid.getY(), CellStatus.Obstacle);
        }

        int i = 0;
        for (final Unit unit : leftPlayer.getUnits()) {
            unit.setSide(Side.Left);
            unit.setCell(new Point(0, i * UNIT_INDENT + BORDER_INDENT));
            register(unit);
            i++;
        }
        this.leftPlayer = leftPlayer;
        i = 0;
        for (final Unit unit : rightPlayer.getUnits()) {
            unit.setSide(Side.Right);
            unit.setCell(new Point(colsCount - 1, i * UNIT_INDENT + BORDER_INDENT));
            register(unit);
            i++;
        }
        this.rightPlayer = rightPlayer;
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
            return Side.Left;
        }
        if (player == rightPlayer) {
            return Side.Right;
        }
        return Side.None;
    }

    @Override
    public boolean moveCurrentUnit(Player player, Point cell) {
        if (player == getCurrentPlayer() && cell.getX() > -1 && cell.getX() < size.getX()
                && cell.getY() > -1 && cell.getY() < size.getY()) {
            getCurrentUnit().setCell(cell);
            return true;
        }
        return false;
    }

    @Override
    public boolean nextTurn(Player player) {
        if (player == getCurrentPlayer()) {
            turnNumber++;
            unitQueue.add(unitQueue.remove());
            while (player != getCurrentPlayer()) {
                turnNumber++;
                unitQueue.add(unitQueue.remove());
            }
            return true;
        }
        return false;
    }

    private Player getCurrentPlayer() {
        switch (getCurrentUnit().getSide()) {
            case Left: return leftPlayer;
            case Right: return rightPlayer;
            default: return null;
        }
    }

    private void register(Unit unit) {
        map.get(unit.getCell().getX()).set(unit.getCell().getY(), CellStatus.Ship);
        unitQueue.add(unit);
        uniqueShips.add(unit.getShip());
        if (unit.getFirstGun() != null) {
            uniqueGuns.add(unit.getFirstGun());
        }
        if (unit.getSecondGun() != null) {
            uniqueGuns.add(unit.getSecondGun());
        }
    }
}
