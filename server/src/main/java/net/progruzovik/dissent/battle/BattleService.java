package net.progruzovik.dissent.battle;

import net.progruzovik.dissent.model.battle.Field;
import net.progruzovik.dissent.model.battle.Side;
import net.progruzovik.dissent.model.battle.Unit;
import net.progruzovik.dissent.model.battle.UnitQueue;
import net.progruzovik.dissent.model.battle.action.Action;
import net.progruzovik.dissent.model.battle.action.ActionType;
import net.progruzovik.dissent.model.battle.action.Move;
import net.progruzovik.dissent.model.battle.action.Shot;
import net.progruzovik.dissent.model.entity.Ship;
import net.progruzovik.dissent.model.player.Captain;
import net.progruzovik.dissent.model.player.Status;
import net.progruzovik.dissent.model.util.Cell;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public final class BattleService implements Battle {

    private static final int UNIT_INDENT = 3;
    private static final int BORDER_INDENT = 4;

    private boolean isRunning = true;

    private final Captain leftCaptain;
    private final Captain rightCaptain;

    private final List<Move> moves = new ArrayList<>();
    private final List<Shot> shots = new ArrayList<>();
    private final List<Action> actions = new ArrayList<>();

    private final UnitQueue unitQueue = new UnitQueue();
    private final Field field;

    public BattleService(Captain leftCaptain, Captain rightCaptain) {
        this.leftCaptain = leftCaptain;
        leftCaptain.setBattle(this);
        this.rightCaptain = rightCaptain;
        rightCaptain.setBattle(this);

        final int maxShipsCountOnSide = Math.max(leftCaptain.getShips().size(), rightCaptain.getShips().size());
        final int colsCount = maxShipsCountOnSide * UNIT_INDENT + BORDER_INDENT * 2;
        field = new Field(new Cell(colsCount, colsCount));
        int i = 0;
        for (final Ship ship : leftCaptain.getShips()) {
            registerUnit(new Unit(Side.LEFT, new Cell(0, i * UNIT_INDENT + BORDER_INDENT), ship));
            i++;
        }
        i = 0;
        for (final Ship ship : rightCaptain.getShips()) {
            registerUnit(new Unit(Side.RIGHT, new Cell(colsCount - 1, i * UNIT_INDENT + BORDER_INDENT), ship));
            i++;
        }
        onNextTurn();
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
        if (leftCaptain.getId().equals(playerId)) {
            return Side.LEFT;
        }
        if (rightCaptain.getId().equals(playerId)) {
            return Side.RIGHT;
        }
        return Side.NONE;
    }

    @Override
    public Action getAction(int number) {
        return actions.get(number);
    }

    @Override
    public int getActionsCount() {
        return actions.size();
    }

    @Override
    public Move getMove(int number) {
        return moves.get(number);
    }

    @Override
    public Shot getShot(int number) {
        return shots.get(number);
    }

    @Override
    public List<Cell> findReachableCellsForCurrentUnit() {
        return field.findReachableCellsForActiveUnit();
    }

    @Override
    public boolean moveCurrentUnit(String playerId, Cell cell) {
        if (isIdBelongsToCurrentPlayer(playerId)) {
            moves.add(field.moveActiveUnit(cell));
            addAction(new Action(moves.size() - 1, ActionType.MOVE));
            return true;
        }
        return false;
    }

    @Override
    public Map<String, List<Cell>> findCellsForCurrentUnitShot(int gunId) {
        return field.findShotAndTargetCells(gunId, unitQueue.getCurrentUnit());
    }

    @Override
    public boolean shootWithCurrentUnit(String playerId, int gunId, Cell cell) {
        if (isIdBelongsToCurrentPlayer(playerId) && field.isCellInCurrentTargets(cell)) {
            final Unit target = unitQueue.getUnitOnCell(cell);
            if (target != null && unitQueue.getCurrentUnit().shoot(gunId, target)) {
                shots.add(new Shot(gunId, cell));
                addAction(new Action(shots.size() - 1, ActionType.SHOT));
                if (target.isDestroyed()) {
                    unitQueue.getQueue().remove(target);
                    field.destroyUnitOnCell(cell);
                    if (!unitQueue.hasUnitsOnBothSides()) {
                        isRunning = false;
                        leftCaptain.setStatus(Status.IDLE);
                        rightCaptain.setStatus(Status.IDLE);
                        addAction(new Action(ActionType.FINISH));
                    }
                }
                return true;
            }
        }
        return false;
    }

    @Override
    public boolean endTurn(String playerId) {
        if (isIdBelongsToCurrentPlayer(playerId)) {
            unitQueue.nextTurn();
            onNextTurn();
            addAction(new Action(ActionType.NEXT_TURN));
            return true;
        }
        return false;
    }

    private boolean isIdBelongsToCurrentPlayer(String id) {
        final Captain currentCaptain = getCurrentPlayer();
        return currentCaptain != null && currentCaptain.getId().equals(id);
    }

    private Captain getCurrentPlayer() {
        if (!isRunning) return null;
        switch (unitQueue.getCurrentUnit().getSide()) {
            case LEFT: return leftCaptain;
            case RIGHT: return rightCaptain;
            default: return null;
        }
    }

    private void onNextTurn() {
        final Captain captain = getCurrentPlayer();
        if (captain != null) {
            field.activateUnit(unitQueue.getCurrentUnit());
            captain.act();
        }
    }

    private void registerUnit(Unit unit) {
        field.addUnit(unit);
        unitQueue.addUnit(unit);
    }

    private void addAction(Action action) {
        leftCaptain.newAction(actions.size(), action);
        rightCaptain.newAction(actions.size(), action);
        actions.add(action);
    }
}
