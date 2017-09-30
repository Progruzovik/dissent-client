package net.progruzovik.dissent.battle;

import net.progruzovik.dissent.model.battle.*;
import net.progruzovik.dissent.model.battle.action.Action;
import net.progruzovik.dissent.model.battle.action.ActionType;
import net.progruzovik.dissent.model.battle.action.Shot;
import net.progruzovik.dissent.model.player.AiPlayer;
import net.progruzovik.dissent.model.player.Player;
import net.progruzovik.dissent.model.util.Cell;

import java.util.*;

public final class BattleService implements Battle {

    private static final int UNIT_INDENT = 3;
    private static final int BORDER_INDENT = 4;

    private final Player leftPlayer;
    private final Player rightPlayer;

    private final List<Action> actions = new ArrayList<>();
    private final List<Shot> shots = new ArrayList<>();

    private final UnitQueue unitQueue = new UnitQueue();
    private final Field field;

    public BattleService(Player leftPlayer, Player rightPlayer) {
        this.leftPlayer = leftPlayer;
        this.rightPlayer = rightPlayer;

        final int maxUnitsCountOnSide = Math.max(leftPlayer.getUnits().size(), rightPlayer.getUnits().size());
        final int colsCount = maxUnitsCountOnSide * UNIT_INDENT + BORDER_INDENT * 2;
        field = new Field(new Cell(colsCount, colsCount));
        int i = 0;
        for (final Unit unit : leftPlayer.getUnits()) {
            unit.init(Side.LEFT, new Cell(0, i * UNIT_INDENT + BORDER_INDENT));
            registerUnit(unit);
            i++;
        }
        i = 0;
        for (final Unit unit : rightPlayer.getUnits()) {
            unit.init(Side.RIGHT, new Cell(colsCount - 1, i * UNIT_INDENT + BORDER_INDENT));
            registerUnit(unit);
            i++;
        }
        onNextTurn();
    }

    @Override
    public int getActionsCount() {
        return actions.size();
    }

    @Override
    public UnitQueue getUnitQueue() {
        return unitQueue;
    }

    @Override
    public Field getField() {
        return field;
    }

    @Override
    public Side getPlayerSide(String playerId) {
        if (leftPlayer.getId().equals(playerId)) {
            return Side.LEFT;
        }
        if (rightPlayer.getId().equals(playerId)) {
            return Side.RIGHT;
        }
        return Side.NONE;
    }

    @Override
    public List<Action> getActions(int fromIndex) {
        return actions.subList(fromIndex, actions.size());
    }

    @Override
    public Shot getShot(int number) {
        return shots.get(number);
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
                actions.add(new Action(ActionType.MOVE));
                field.moveUnit(oldCell, cell);
                field.createPathsForUnit(unitQueue.getCurrentUnit());
                return true;
            }
        }
        return false;
    }

    @Override
    public boolean prepareCurrentUnitGun(String playerId, int gunId) {
        return isIdBelongsToCurrentPlayer(playerId) && unitQueue.getCurrentUnit().prepareGun(gunId);
    }

    @Override
    public Map<String, List<Cell>> findCellsForCurrentUnitShot() {
        return field.findShotAndTargetCells(unitQueue.getCurrentUnit());
    }

    @Override
    public boolean shootWithCurrentUnit(String playerId, Cell cell) {
        if (isIdBelongsToCurrentPlayer(playerId) && field.isCellInCurrentTargets(cell)) {
            final Unit target = unitQueue.getUnitOnCell(cell);
            if (target != null) {
                actions.add(new Action(shots.size(), ActionType.SHOT));
                shots.add(new Shot(unitQueue.getCurrentUnit().getPreparedGun().getId(), cell));
                unitQueue.getCurrentUnit().shoot(target);
                if (target.isDestroyed()) {
                    unitQueue.getQueue().remove(target);
                    field.destroyUnitOnCell(cell);
                }
                return true;
            }
        }
        return false;
    }

    @Override
    public boolean nextTurn(String playerId) {
        if (isIdBelongsToCurrentPlayer(playerId)) {
            actions.add(new Action(ActionType.NEXT_TURN));
            unitQueue.nextTurn();
            onNextTurn();
            if (getCurrentPlayer() instanceof AiPlayer) {
                nextTurn(getCurrentPlayer().getId());
            }
            return true;
        }
        return false;
    }

    private boolean isIdBelongsToCurrentPlayer(String id) {
        final Player currentPlayer = getCurrentPlayer();
        return currentPlayer != null && currentPlayer.getId().equals(id);
    }

    private Player getCurrentPlayer() {
        switch (unitQueue.getCurrentUnit().getSide()) {
            case LEFT: return leftPlayer;
            case RIGHT: return rightPlayer;
            default: return null;
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
