package net.progruzovik.dissent.captain;

import net.progruzovik.dissent.battle.model.Battle;
import net.progruzovik.dissent.battle.model.Side;
import net.progruzovik.dissent.model.entity.Ship;

import java.util.List;
import java.util.Observer;

public interface Captain extends Observer {

    String getId();

    List<Ship> getShips();

    Battle getBattle();

    void addToBattle(Side side, Battle battle);
}
