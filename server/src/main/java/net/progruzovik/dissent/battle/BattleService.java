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
import net.progruzovik.dissent.model.player.Player;
import net.progruzovik.dissent.model.player.Status;
import net.progruzovik.dissent.model.util.Cell;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public final class BattleService implements Battle {

    private static final int UNIT_INDENT = 3;
    private static final int BORDER_INDENT = 4;

    private boolean isRunning = true;

    private final Player leftPlayer;
    private final Player rightPlayer;

    private final List<Move> moves = new ArrayList<>();
    private final List<Shot> shots = new ArrayList<>();
    private final List<Action> actions = new ArrayList<>();

    private final UnitQueue unitQueue = new UnitQueue();
    private final Field field;

    public BattleService(Player leftPlayer, Player rightPlayer) {
        this.leftPlayer = leftPlayer;
        leftPlayer.setBattle(this);
        this.rightPlayer = rightPlayer;
        rightPlayer.setBattle(this);

        final int maxShipsCountOnSide = Math.max(leftPlayer.getShips().size(), rightPlayer.getShips().size());
        final int colsCount = maxShipsCountOnSide * UNIT_INDENT + BORDER_INDENT * 2;
        field = new Field(new Cell(colsCount, colsCount));
        int i = 0;
        for (final Ship ship : leftPlayer.getShips()) {
            registerUnit(new Unit(Side.LEFT, new Cell(0, i * UNIT_INDENT + BORDER_INDENT), ship));
            i++;
        }
        i = 0;
        for (final Ship ship : rightPlayer.getShips()) {
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
        if (leftPlayer.getId().equals(playerId)) {
            return Side.LEFT;
        }
        if (rightPlayer.getId().equals(playerId)) {
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
                        leftPlayer.setStatus(Status.IDLE);
                        rightPlayer.setStatus(Status.IDLE);
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
        final Player currentPlayer = getCurrentPlayer();
        return currentPlayer != null && currentPlayer.getId().equals(id);
    }

    private Player getCurrentPlayer() {
        if (!isRunning) return null;
        switch (unitQueue.getCurrentUnit().getSide()) {
            case LEFT: return leftPlayer;
            case RIGHT: return rightPlayer;
            default: return null;
        }
    }

    private void onNextTurn() {
        final Player player = getCurrentPlayer();
        if (player != null) {
            field.activateUnit(unitQueue.getCurrentUnit());
            player.act();
        }
    }

    private void registerUnit(Unit unit) {
        field.addUnit(unit);
        unitQueue.addUnit(unit);
    }

    private void addAction(Action action) {
        leftPlayer.newAction(actions.size(), action);
        rightPlayer.newAction(actions.size(), action);
        actions.add(action);
    }
}
