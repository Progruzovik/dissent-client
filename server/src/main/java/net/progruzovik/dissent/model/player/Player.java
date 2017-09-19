package net.progruzovik.dissent.model.player;

import net.progruzovik.dissent.battle.Battle;
import net.progruzovik.dissent.model.Unit;

import java.util.List;

public interface Player {

    List<Unit> getUnits();

    Battle getBattle();

    void setBattle(Battle battle);
}
