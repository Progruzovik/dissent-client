package net.progruzovik.dissent.captain;

import net.progruzovik.dissent.battle.model.Battle;
import net.progruzovik.dissent.battle.model.Side;
import net.progruzovik.dissent.captain.model.Fleet;

public abstract class AbstractCaptain implements Captain {

    private final Fleet fleet = new Fleet();
    private Battle battle;

    @Override
    public Fleet getFleet() {
        return fleet;
    }

    @Override
    public Battle getBattle() {
        return battle;
    }

    @Override
    public void addToBattle(Side side, Battle battle) {
        battle.registerFleet(side, fleet);
        this.battle = battle;
    }
}
