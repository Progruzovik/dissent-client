package net.progruzovik.dissent.battle;

import net.progruzovik.dissent.model.battle.Field;
import net.progruzovik.dissent.model.battle.Side;
import net.progruzovik.dissent.model.battle.Unit;
import net.progruzovik.dissent.model.battle.UnitQueue;
import net.progruzovik.dissent.model.player.Player;
import net.progruzovik.dissent.model.util.Cell;

import java.util.*;

public final class BattleService implements Battle {

    private static final int UNIT_INDENT = 3;
    private static final int BORDER_INDENT = 4;

    private final String leftPlayerId;
    private final String rightPlayerId;

    private final UnitQueue unitQueue = new UnitQueue();
    private final Field field;

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
    public Field getField() {
        return field;
    }

    @Override
    public UnitQueue getUnitQueue() {
        return unitQueue;
    }

    @Override
    public Side getPlayerSide(String playerId) {
        if (leftPlayerId.equals(playerId)) {
            return Side.LEFT;
        }
        if (rightPlayerId.equals(playerId)) {
            return Side.RIGHT;
        }
        return Side.NONE;
    }

    @Override
    public List<Cell> findReachableCellsForCurrentUnit() {
        return field.findReachableCellsForUnit(unitQueue.getCurrentUnit());
    }

    @Override
    public boolean moveCurrentUnit(String playerId, Cell cell) {
        if (isIdBelongsToCurrentPlayer(playerId)
                && cell.isInBorders(field.getSize()) && field.isCellInCurrentPaths(cell)) {
            final Cell oldCell = unitQueue.getCurrentUnit().getCell();
            if (unitQueue.getCurrentUnit().move(cell)) {
                field.moveUnit(oldCell, cell);
                field.createPathsForUnit(unitQueue.getCurrentUnit());
                return true;
            }
        }
        return false;
    }

    @Override
    public boolean prepareCurrentUnitGun(String playerId, int gunNumber) {
        return isIdBelongsToCurrentPlayer(playerId) && unitQueue.getCurrentUnit().prepareGun(gunNumber);
    }

    @Override
    public Map<String, List<Cell>> findCellsForCurrentUnitShot() {
        return field.findShotAndTargetCells(unitQueue.getCurrentUnit());
    }

    @Override
    public boolean shootWithCurrentUnit(String playerId, Cell cell) {
        return isIdBelongsToCurrentPlayer(playerId) && field.isCellInCurrentTargets(cell)
                && unitQueue.getCurrentUnit().shoot(unitQueue.removeUnitOnCell(cell));
    }

    @Override
    public boolean nextTurn(String playerId) {
        if (isIdBelongsToCurrentPlayer(playerId)) {
            unitQueue.nextTurn();
            while (!isIdBelongsToCurrentPlayer(playerId)) {
                unitQueue.nextTurn();
            }
            onNextTurn();
            return true;
        }
        return false;
    }

    private boolean isIdBelongsToCurrentPlayer(String id) {
        switch (unitQueue.getCurrentUnit().getSide()) {
            case LEFT: return leftPlayerId.equals(id);
            case RIGHT: return rightPlayerId.equals(id);
            default: return false;
        }
    }

    private void registerUnit(Unit unit) {
        field.addUnit(unit);
        unitQueue.addUnit(unit);
    }

    private void onNextTurn() {
        unitQueue.getCurrentUnit().makeCurrent();
        field.createPathsForUnit(unitQueue.getCurrentUnit());
    }
}
