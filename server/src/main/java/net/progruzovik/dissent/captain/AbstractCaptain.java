package net.progruzovik.dissent.captain;

import net.progruzovik.dissent.battle.model.Battle;
import net.progruzovik.dissent.battle.model.Side;
import net.progruzovik.dissent.model.entity.Ship;

import java.util.ArrayList;
import java.util.List;

public abstract class AbstractCaptain implements Captain {

    private final List<Ship> ships = new ArrayList<>();
    private Battle battle;

    @Override
    public List<Ship> getShips() {
        return ships;
    }

    @Override
    public Battle getBattle() {
        return battle;
    }

    @Override
    public void addToBattle(Side side, Battle battle) {
        battle.addObserver(this);
        battle.addShips(side, ships);
        this.battle = battle;
    }
}
