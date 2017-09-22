package net.progruzovik.dissent.battle;

import net.progruzovik.dissent.model.battle.Field;
import net.progruzovik.dissent.model.Gun;
import net.progruzovik.dissent.model.Hull;
import net.progruzovik.dissent.model.Unit;
import net.progruzovik.dissent.model.player.Player;
import net.progruzovik.dissent.model.util.Cell;

import java.util.*;

public final class BattleService implements Battle {

    private static final int UNIT_INDENT = 3;
    private static final int BORDER_INDENT = 4;

    private int turnNumber = 0;

    private final String leftPlayerId;
    private final String rightPlayerId;

    private final Field field;
    private final LinkedList<Unit> unitQueue = new LinkedList<>();

    private final Set<Hull> uniqueHulls = new HashSet<>();
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
        this.leftPlayerId = leftPlayer.getId();
        i = 0;
        for (final Unit unit : rightPlayer.getUnits()) {
            unit.init(Side.RIGHT, new Cell(colsCount - 1, i * UNIT_INDENT + BORDER_INDENT));
            registerUnit(unit);
            i++;
        }
        this.rightPlayerId = rightPlayer.getId();
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
    public Set<Hull> getUniqueHulls() {
        return uniqueHulls;
    }

    @Override
    public Set<Gun> getUniqueGuns() {
        return uniqueGuns;
    }

    @Override
    public Side getPlayerSide(String playerId) {
        if (playerId.equals(leftPlayerId)) {
            return Side.LEFT;
        }
        if (playerId.equals(rightPlayerId)) {
            return Side.RIGHT;
        }
        return Side.NONE;
    }

    @Override
    public List<Cell> findReachableCellsForCurrentUnit() {
        return field.findReachableCellsForUnit(getCurrentUnit());
    }

    @Override
    public boolean moveCurrentUnit(String playerId, Cell cell) {
        if (isIdBelongsToCurrentPlayer(playerId)
                && cell.isInBorders(field.getSize()) && field.isCellInCurrentPaths(cell)) {
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
    public boolean prepareCurrentUnitGun(String playerId, int gunNumber) {
        return isIdBelongsToCurrentPlayer(playerId) && getCurrentUnit().prepareGun(gunNumber);
    }

    @Override
    public Map<String, List<Cell>> findCellsForCurrentUnitShot() {
        return field.findShotAndTargetCells(getCurrentUnit().getCell(), getCurrentUnit().getPreparedGun().getRadius());
    }

    @Override
    public boolean shootByCurrentUnit(String playerId, Cell cell) {
        if (isIdBelongsToCurrentPlayer(playerId) && field.isCellInCurrentTargets(cell)) {
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
    public boolean nextTurn(String playerId) {
        if (isIdBelongsToCurrentPlayer(playerId)) {
            turnNumber++;
            unitQueue.offer(unitQueue.poll());
            while (!isIdBelongsToCurrentPlayer(playerId)) {
                turnNumber++;
                unitQueue.offer(unitQueue.poll());
            }
            onNextTurn();
            return true;
        }
        return false;
    }

    private boolean isIdBelongsToCurrentPlayer(String id) {
        switch (getCurrentUnit().getSide()) {
            case LEFT: return leftPlayerId.equals(id);
            case RIGHT: return rightPlayerId.equals(id);
            default: return false;
        }
    }

    private void registerUnit(Unit unit) {
        field.addUnit(unit.getCell());
        unitQueue.offer(unit);
        uniqueHulls.add(unit.getHull());
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
