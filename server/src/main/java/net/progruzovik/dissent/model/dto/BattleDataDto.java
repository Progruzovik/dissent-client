package net.progruzovik.dissent.model.dto;

import net.progruzovik.dissent.battle.model.Side;
import net.progruzovik.dissent.battle.model.Unit;
import net.progruzovik.dissent.battle.model.util.Cell;
import org.springframework.lang.NonNull;

import java.util.List;

@SuppressWarnings("unused")
public final class BattleDataDto {

    private final @NonNull Side playerSide;
    private final @NonNull Cell fieldSize;

    private final @NonNull List<LogEntryDto> log;

    private final @NonNull List<Cell> asteroids;
    private final @NonNull List<Cell> clouds;

    private final @NonNull List<Unit> units;
    private final @NonNull List<Unit> destroyedUnits;

    public BattleDataDto(@NonNull Side playerSide, @NonNull Cell fieldSize, @NonNull List<LogEntryDto> log,
                         @NonNull List<Cell> asteroids, @NonNull List<Cell> clouds,
                         @NonNull List<Unit> units, @NonNull List<Unit> destroyedUnits) {
        this.playerSide = playerSide;
        this.fieldSize = fieldSize;
        this.log = log;
        this.asteroids = asteroids;
        this.clouds = clouds;
        this.units = units;
        this.destroyedUnits = destroyedUnits;
    }

    @NonNull
    public Side getPlayerSide() {
        return playerSide;
    }

    @NonNull
    public Cell getFieldSize() {
        return fieldSize;
    }

    @NonNull
    public List<LogEntryDto> getLog() {
        return log;
    }

    @NonNull
    public List<Cell> getAsteroids() {
        return asteroids;
    }

    @NonNull
    public List<Cell> getClouds() {
        return clouds;
    }

    @NonNull
    public List<Unit> getUnits() {
        return units;
    }

    @NonNull
    public List<Unit> getDestroyedUnits() {
        return destroyedUnits;
    }
}
