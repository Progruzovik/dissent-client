package net.progruzovik.dissent.battle.model;

import net.progruzovik.dissent.battle.exception.InvalidShotException;
import net.progruzovik.dissent.battle.model.field.Field;
import net.progruzovik.dissent.battle.model.field.PathNode;
import net.progruzovik.dissent.battle.model.field.gun.GunCells;
import net.progruzovik.dissent.battle.model.util.Cell;
import net.progruzovik.dissent.captain.Captain;
import net.progruzovik.dissent.model.dto.BattleDataDto;
import net.progruzovik.dissent.model.dto.LogEntryDto;
import net.progruzovik.dissent.model.dto.ShotDto;
import net.progruzovik.dissent.model.domain.Ship;
import net.progruzovik.dissent.model.event.Event;
import net.progruzovik.dissent.model.event.EventSubject;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;
import reactor.core.publisher.DirectProcessor;
import reactor.core.publisher.Flux;

import java.util.ArrayList;
import java.util.List;

import static net.progruzovik.dissent.model.event.EventSubject.*;

public final class Battle {

    private boolean isRunning = true;

    private final @NonNull List<LogEntryDto> battleLog = new ArrayList<>();

    private final @NonNull UnitQueue unitQueue;
    private final @NonNull Field field;

    private final @NonNull Captain leftCaptain;
    private final @NonNull Captain rightCaptain;

    private final DirectProcessor<Event<?>> processor;

    public Battle(@NonNull UnitQueue unitQueue, @NonNull Field field,
                  @NonNull Captain leftCaptain, @NonNull Captain rightCaptain) {
        this.unitQueue = unitQueue;
        this.field = field;
        this.leftCaptain = leftCaptain;
        this.rightCaptain = rightCaptain;
        processor = DirectProcessor.create();
    }

    public boolean isRunning() {
        return isRunning;
    }

    public Flux<Event<?>> getEvents() {
        return processor;
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
        startNewTurn();
    }

    public void moveCurrentUnit(@NonNull String captainId, @NonNull Cell cell) {
        if (isIdBelongsToCurrentCaptain(captainId)) {
            declareEvent(new Event<>(MOVE, field.moveActiveUnit(cell)));
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
        declareEvent(new Event<>(EventSubject.SHOT, new ShotDto(gunId, damage, targetUnit.getFirstCell())));
        if (targetUnit.getShip().getStrength() == 0) {
            unitQueue.getUnits().remove(targetUnit);
            field.destroyUnit(targetUnit);
            if (!unitQueue.hasUnitsOnBothSides()) {
                isRunning = false;
                field.resetActiveUnit();
                declareEvent(new Event<>(BATTLE_FINISH));
            }
        }
    }

    public void endTurn(@NonNull String captainId) {
        if (!isIdBelongsToCurrentCaptain(captainId)) return;
        unitQueue.nextTurn();
        declareEvent(new Event<>(NEXT_TURN));
        startNewTurn();
    }

    @NonNull
    private Side getCaptainSide(@NonNull String captainId) {
        if (leftCaptain.getId().equals(captainId)) return Side.LEFT;
        if (rightCaptain.getId().equals(captainId)) return Side.RIGHT;
        return Side.NONE;
    }

    @Nullable
    private String getCurrentCaptainId() {
        if (!isRunning) return null;
        switch (unitQueue.getCurrentUnit().getSide()) {
            case LEFT: return leftCaptain.getId();
            case RIGHT: return rightCaptain.getId();
            default: return null;
        }
    }

    private void startNewTurn() {
        unitQueue.getCurrentUnit().activate();
        field.setActiveUnit(unitQueue.getCurrentUnit());
        declareEvent(new Event<>(NEW_TURN_START));
    }

    private void declareEvent(Event<?> event) {
        processor.onNext(event);
    }
}
