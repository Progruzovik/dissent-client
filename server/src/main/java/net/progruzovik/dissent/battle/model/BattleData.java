package net.progruzovik.dissent.battle.model;

import net.progruzovik.dissent.model.entity.Gun;
import net.progruzovik.dissent.model.entity.Hull;
import net.progruzovik.dissent.model.util.Cell;

import java.util.List;
import java.util.Set;

public final class BattleData {

    private final Side playerSide;
    private final Cell fieldSize;

    private final Set<Hull> hulls;
    private final Set<Gun> guns;

    private final List<Cell> asteroids;
    private final List<Cell> clouds;

    private final List<Unit> units;
    private final List<Unit> destroyedUnits;

    BattleData(Side playerSide, Cell fieldSize, Set<Hull> hulls, Set<Gun> guns,
               List<Cell> asteroids, List<Cell> clouds, List<Unit> units, List<Unit> destroyedUnits) {
        this.playerSide = playerSide;
        this.fieldSize = fieldSize;
        this.hulls = hulls;
        this.guns = guns;
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

    public Set<Hull> getHulls() {
        return hulls;
    }

    public Set<Gun> getGuns() {
        return guns;
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
