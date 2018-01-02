package net.progruzovik.dissent.battle.model;

import net.progruzovik.dissent.model.util.Cell;

import java.util.List;

public final class BattleData {

    private final Side playerSide;
    private final Cell fieldSize;

    private final List<Cell> asteroids;
    private final List<Cell> clouds;

    private final List<Unit> units;
    private final List<Unit> destroyedUnits;

    BattleData(Side playerSide, Cell fieldSize, List<Cell> asteroids,
               List<Cell> clouds, List<Unit> units, List<Unit> destroyedUnits) {
        this.playerSide = playerSide;
        this.fieldSize = fieldSize;
        this.asteroids = asteroids;
        this.clouds = clouds;
        this.units = units;
        this.destroyedUnits = destroyedUnits;
    }

    public Side getPlayerSide() {
        return playerSide;
    }

    public Cell getFieldSize() {
        return fieldSize;
    }

    public List<Cell> getAsteroids() {
        return asteroids;
    }

    public List<Cell> getClouds() {
        return clouds;
    }

    public List<Unit> getUnits() {
        return units;
    }

    public List<Unit> getDestroyedUnits() {
        return destroyedUnits;
    }
}
