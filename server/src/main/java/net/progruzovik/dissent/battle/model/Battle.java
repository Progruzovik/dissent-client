package net.progruzovik.dissent.battle.model;

import net.progruzovik.dissent.battle.exception.InvalidShotException;
import net.progruzovik.dissent.battle.model.field.Field;
import net.progruzovik.dissent.battle.model.field.gun.GunCells;
import net.progruzovik.dissent.battle.model.field.move.PathNode;
import net.progruzovik.dissent.battle.model.util.Cell;
import net.progruzovik.dissent.model.dto.BattleDataDto;
import net.progruzovik.dissent.model.dto.LogEntryDto;
import net.progruzovik.dissent.model.dto.ShotDto;
import net.progruzovik.dissent.model.entity.Ship;
import net.progruzovik.dissent.model.event.Event;
import net.progruzovik.dissent.model.event.EventSubject;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;

import java.util.ArrayList;
import java.util.List;
import java.util.Observable;

import static net.progruzovik.dissent.model.event.EventSubject.*;

public final class Battle extends Observable {

    private boolean isRunning = true;

    private final @NonNull String leftCaptainId;
    private final @NonNull String rightCaptainId;

    private final @NonNull List<LogEntryDto> battleLog = new ArrayList<>();

    private final @NonNull UnitQueue unitQueue;
    private final @NonNull Field field;

    public Battle(@NonNull String leftCaptainId, @NonNull String rightCaptainId,
                  @NonNull UnitQueue unitQueue, @NonNull Field field) {
        this.leftCaptainId = leftCaptainId;
        this.rightCaptainId = rightCaptainId;
        this.unitQueue = unitQueue;
        this.field = field;
    }

    public boolean isRunning() {
        return isRunning;
    }

    @NonNull
    public Unit getCurrentUnit() {
        return unitQueue.getCurrentUnit();
    }

    @NonNull
    public BattleDataDto getBattleData(String captainId) {
        return new BattleDataDto(getCaptainSide(captainId), field.getSize(), battleLog,
                field.getAsteroids(), field.getClouds(), unitQueue.getUnits(), field.getDestroyedUnits());
    }

    @NonNull
    public List<List<PathNode>> getPaths() {
        return field.getPaths();
    }

    @NonNull
    public List<Cell> getReachableCells() {
        return field.getReachableCells();
    }

    public boolean isIdBelongsToCurrentCaptain(@NonNull String id) {
        return id.equals(getCurrentCaptainId());
    }

    @NonNull
    public GunCells getGunCells(int gunId) {
        return field.getGunCells(gunId);
    }

    @Override
    public void notifyObservers() {
        setChanged();
        super.notifyObservers();
    }

    @Override
    public void notifyObservers(@NonNull Object arg) {
        setChanged();
        super.notifyObservers(arg);
    }

    public void addShips(@NonNull Side side, @NonNull List<Ship> ships) {
        for (int i = 0; i < ships.size(); i++) {
            final Ship ship = ships.get(i);
            final int x = side == Side.RIGHT ? field.getSize().getX() - ship.getHull().getWidth() : 0;
            final int y = i * (Field.UNIT_INDENT + 1) + Field.BORDER_INDENT;
            final Unit unit = new Unit(new Cell(x, y), side, ship);
            field.addUnit(unit);
            unitQueue.addUnit(unit);
        }
    }

    public void startBattle() {
        onNextTurn();
    }

    public void moveCurrentUnit(@NonNull String captainId, @NonNull Cell cell) {
        if (isIdBelongsToCurrentCaptain(captainId)) {
            notifyObservers(new Event<>(MOVE, field.moveActiveUnit(cell)));
        }
    }

    public void shootWithCurrentUnit(@NonNull String captainId, int gunId, @NonNull Cell cell) {
        final double hittingChance = field.findHittingChance(gunId, cell);
        if (!isIdBelongsToCurrentCaptain(captainId) || hittingChance == 0) return;
        final Unit currentUnit = unitQueue.getCurrentUnit();
        final Unit targetUnit = unitQueue.findUnitOnCell(cell)
                .orElseThrow(() -> new InvalidShotException(String.format("There is no target on cell %s!", cell)));

        final int damage = currentUnit.shoot(gunId, hittingChance, targetUnit);
        field.updateActiveUnit();
        battleLog.add(new LogEntryDto(currentUnit.getSide(), damage,
                targetUnit.isDestroyed(), currentUnit.getShip().findGunById(gunId),
                currentUnit.getShip().getHull(), targetUnit.getShip().getHull()));
        notifyObservers(new Event<>(EventSubject.SHOT, new ShotDto(gunId, damage, targetUnit.getFirstCell())));
        if (targetUnit.getShip().getStrength() == 0) {
            unitQueue.getUnits().remove(targetUnit);
            field.destroyUnit(targetUnit);
            if (!unitQueue.hasUnitsOnBothSides()) {
                isRunning = false;
                field.resetActiveUnit();
                notifyObservers(new Event<>(BATTLE_FINISH));
                deleteObservers();
            }
        }
    }

    public void endTurn(@NonNull String captainId) {
        if (!isIdBelongsToCurrentCaptain(captainId)) return;
        unitQueue.nextTurn();
        notifyObservers(new Event<>(NEXT_TURN));
        onNextTurn();
    }

    @NonNull
    private Side getCaptainSide(@NonNull String captainId) {
        if (leftCaptainId.equals(captainId)) return Side.LEFT;
        if (rightCaptainId.equals(captainId)) return Side.RIGHT;
        return Side.NONE;
    }

    @Nullable
    private String getCurrentCaptainId() {
        if (!isRunning) return null;
        switch (unitQueue.getCurrentUnit().getSide()) {
            case LEFT: return leftCaptainId;
            case RIGHT: return rightCaptainId;
            default: return null;
        }
    }

    private void onNextTurn() {
        unitQueue.getCurrentUnit().activate();
        field.setActiveUnit(unitQueue.getCurrentUnit());
        notifyObservers(new Event<>(NEW_TURN_START));
    }
}
