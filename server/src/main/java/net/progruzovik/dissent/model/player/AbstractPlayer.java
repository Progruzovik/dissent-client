package net.progruzovik.dissent.model.player;

import net.progruzovik.dissent.battle.Battle;
import net.progruzovik.dissent.model.Unit;

import java.util.ArrayList;
import java.util.List;

public abstract class AbstractPlayer implements Player {

    private Battle battle;
    private final List<Unit> units = new ArrayList<>();

    @Override
    public Battle getBattle() {
        return battle;
    }

    @Override
    public void setBattle(Battle battle) {
        this.battle = battle;
    }

    @Override
    public List<Unit> getUnits() {
        return units;
    }
}
