package net.progruzovik.dissent.model.player;

import net.progruzovik.dissent.battle.Battle;
import net.progruzovik.dissent.model.battle.Unit;
import net.progruzovik.dissent.model.battle.action.Action;

import java.util.List;

public interface Player {

    String getId();

    List<Unit> getUnits();

    Battle getBattle();

    void setBattle(Battle battle);

    void newAction(int number, Action action);
}
