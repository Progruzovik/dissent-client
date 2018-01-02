package net.progruzovik.dissent.battle.captain;

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
    public void registerBattle(Side side, Battle battle) {
        if (battle != null) {
            for (int i = 0; i < getShips().size(); i++) {
                getShips().get(i).setStrength(getShips().get(i).getHull().getStrength());
                battle.registerShip(i, side, getShips().get(i));
            }
        }
        this.battle = battle;
    }
}
