package net.progruzovik.dissent.model.player;

import net.progruzovik.dissent.battle.Battle;
import net.progruzovik.dissent.model.battle.action.Action;
import net.progruzovik.dissent.model.entity.Ship;

import java.util.List;

public interface Captain {

    String getId();

    List<Ship> getShips();

    void setStatus(Status status);

    Battle getBattle();

    void setBattle(Battle battle);

    void newAction(int number, Action action);

    void act();
}
