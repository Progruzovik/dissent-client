package net.progruzovik.dissent.battle;

import net.progruzovik.dissent.model.Field;
import net.progruzovik.dissent.model.Gun;
import net.progruzovik.dissent.model.Ship;
import net.progruzovik.dissent.model.Unit;
import net.progruzovik.dissent.model.player.Player;
import net.progruzovik.dissent.model.util.Cell;

import java.util.*;

public final class BattleService implements Battle {

    private static final int UNIT_INDENT = 3;
    private static final int BORDER_INDENT = 4;

    private int turnNumber = 0;

    private final Player leftPlayer;
    private final Player rightPlayer;

    private final Field field;
    private final LinkedList<Unit> unitQueue = new LinkedList<>();

    private final Set<Ship> uniqueShips = new HashSet<>();
    private final Set<Gun> uniqueGuns = new HashSet<>();

    public BattleService(Player leftPlayer, Player rightPlayer) {
        final int maxUnitsCountOnSide = Math.max(leftPlayer.getUnits().size(), rightPlayer.getUnits().size());
        final int colsCount = maxUnitsCountOnSide * UNIT_INDENT + BORDER_INDENT * 2;
        field = new Field(new Cell(colsCount, colsCount));

        int i = 0;
        for (final Unit unit : leftPlayer.getUnits()) {
            unit.init(Side.LEFT, new Cell(0, i * UNIT_INDENT + BORDER_INDENT));
            registerUnit(unit);
            i++;
        }
        this.leftPlayer = leftPlayer;
        i = 0;
        for (final Unit unit : rightPlayer.getUnits()) {
            unit.init(Side.RIGHT, new Cell(colsCount - 1, i * UNIT_INDENT + BORDER_INDENT));
            registerUnit(unit);
            i++;
        }
        this.rightPlayer = rightPlayer;
        onNextTurn();
    }

    @Override
    public int getTurnNumber() {
        return turnNumber;
    }

    @Override
    public Field getField() {
        return field;
    }

    @Override
    public Queue<Unit> getUnitQueue() {
        return unitQueue;
    }

    @Override
    public Unit getCurrentUnit() {
        return unitQueue.element();
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
    public List<Cell> findReachableCellsForCurrentUnit() {
        return field.findReachableCellsForUnit(getCurrentUnit());
    }

    @Override
    public boolean moveCurrentUnit(Player player, Cell cell) {
        if (player == getCurrentPlayer() && cell.isInBorders(field.getSize()) && field.isCellInCurrentPaths(cell)) {
            final Cell oldCell = getCurrentUnit().getCell();
            if (getCurrentUnit().move(cell)) {
                field.moveUnit(oldCell, cell);
                field.createPathsForUnit(getCurrentUnit());
                return true;
            }
        }
        return false;
    }

    @Override
    public boolean prepareCurrentUnitGun(Player player, int gunNumber) {
        return player == getCurrentPlayer() && getCurrentUnit().prepareGun(gunNumber);
    }

    @Override
    public Map<String, List<Cell>> findCellsForCurrentUnitShot() {
        return field.findShotAndTargetCells(getCurrentUnit().getCell(), getCurrentUnit().getPreparedGun().getRadius());
    }

    @Override
    public boolean shootByCurrentUnit(Player player, Cell cell) {
        if (player == getCurrentPlayer() && field.isCellInCurrentTargets(cell)) {
            getCurrentUnit().shoot();
            int i = 0;
            boolean isTargetFound = false;
            while (!isTargetFound) {
                if (unitQueue.get(i).getCell().equals(cell)) {
                    unitQueue.get(i).destroy();
                    unitQueue.remove(i);
                    isTargetFound = true;
                }
                i++;
            }
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

    private void registerUnit(Unit unit) {
        field.addUnit(unit.getCell());
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
        field.createPathsForUnit(getCurrentUnit());
    }
}
