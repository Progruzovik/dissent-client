package net.progruzovik.dissent.model.battle;

import net.progruzovik.dissent.battle.player.Captain;
import net.progruzovik.dissent.battle.player.Status;
import net.progruzovik.dissent.exception.InvalidShotException;
import net.progruzovik.dissent.model.battle.field.Field;
import net.progruzovik.dissent.model.battle.field.PathNode;
import net.progruzovik.dissent.model.entity.Ship;
import net.progruzovik.dissent.model.socket.Message;
import net.progruzovik.dissent.model.util.Cell;

import java.util.List;

public final class Battle {

    private static final int UNIT_INDENT = 3;
    private static final int BORDER_INDENT = 4;

    private boolean isRunning = true;

    private final Captain leftCaptain;
    private final Captain rightCaptain;

    private final UnitQueue unitQueue = new UnitQueue();
    private final Field field;

    public Battle(Captain leftCaptain, Captain rightCaptain) {
        this.leftCaptain = leftCaptain;
        leftCaptain.setBattle(this);
        this.rightCaptain = rightCaptain;
        rightCaptain.setBattle(this);

        final int maxShipsCountOnSide = Math.max(leftCaptain.getShips().size(), rightCaptain.getShips().size());
        final int colsCount = maxShipsCountOnSide * UNIT_INDENT + BORDER_INDENT * 2;
        field = new Field(new Cell(colsCount, colsCount));
        int i = 0;
        for (final Ship ship : leftCaptain.getShips()) {
            registerUnit(new Unit(new Cell(0, i * UNIT_INDENT + BORDER_INDENT), Side.LEFT, ship));
            i++;
        }
        i = 0;
        for (final Ship ship : rightCaptain.getShips()) {
            registerUnit(new Unit(new Cell(colsCount - 1, i * UNIT_INDENT + BORDER_INDENT), Side.RIGHT, ship));
            i++;
        }
        onNextTurn();
    }

    public BattleData getBattleData(String playerId) {
        return new BattleData(getPlayerSide(playerId), field.getSize(),
                unitQueue.getUniqueHulls(), unitQueue.getUniqueGuns(), field.getAsteroids(),
                field.getClouds(), unitQueue.getUnits(), field.getDestroyedUnits());
    }

    public List<List<PathNode>> getCurrentPaths() {
        return field.getCurrentPaths();
    }

    public List<Cell> getShotCells() {
        return field.getShotCells();
    }

    public List<Cell> getTargetCells() {
        return field.getTargetCells();
    }

    public List<Cell> findReachableCellsForActiveUnit() {
        return field.findReachableCellsForActiveUnit();
    }

    public void moveCurrentUnit(String playerId, Cell cell) {
        if (isIdBelongsToCurrentCaptain(playerId)) {
            createMessage(new Message<>("move", field.moveActiveUnit(cell)));
        }
    }

    public void prepareGunForActiveUnit(int gunId) {
        field.prepareGunForActiveUnit(gunId);
    }

    public void shootWithCurrentUnit(String playerId, int gunId, Cell cell) {
        if (isIdBelongsToCurrentCaptain(playerId) && field.canActiveUnitHitCell(gunId, cell)) {
            final Unit target = unitQueue.getUnitOnCell(cell);
            if (target == null) throw new InvalidShotException();

            final int damage = unitQueue.getCurrentUnit().shoot(gunId, target);
            field.createPathsForActiveUnit();
            createMessage(new Message<>("shot", new Shot(gunId, damage, cell)));
            if (target.getShip().getStrength() == 0) {
                unitQueue.getUnits().remove(target);
                field.destroyUnit(target);
                if (!unitQueue.hasUnitsOnBothSides()) {
                    isRunning = false;
                    leftCaptain.setStatus(Status.IDLE);
                    rightCaptain.setStatus(Status.IDLE);
                    createMessage(new Message<>("battleFinish", null));
                }
            }
        }
    }

    public void endTurn(String captainId) {
        if (isIdBelongsToCurrentCaptain(captainId)) {
            unitQueue.nextTurn();
            createMessage(new Message<>("nextTurn", null));
            onNextTurn();
        }
    }

    private boolean isIdBelongsToCurrentCaptain(String id) {
        return getCurrentCaptain() != null && getCurrentCaptain().getId().equals(id);
    }

    private Side getPlayerSide(String playerId) {
        if (leftCaptain.getId().equals(playerId)) return Side.LEFT;
        if (rightCaptain.getId().equals(playerId)) return Side.RIGHT;
        return Side.NONE;
    }

    private Captain getCurrentCaptain() {
        if (!isRunning) return null;
        switch (unitQueue.getCurrentUnit().getSide()) {
            case LEFT: return leftCaptain;
            case RIGHT: return rightCaptain;
            default: return null;
        }
    }

    private void onNextTurn() {
        final Captain captain = getCurrentCaptain();
        if (captain != null) {
            unitQueue.getCurrentUnit().activate();
            field.setActiveUnit(unitQueue.getCurrentUnit());
            captain.act(unitQueue.getCurrentUnit());
        }
    }

    private void registerUnit(Unit unit) {
        field.addUnit(unit);
        unitQueue.addUnit(unit);
    }

    private void createMessage(Message message) {
        leftCaptain.send(message);
        rightCaptain.send(message);
    }
}
