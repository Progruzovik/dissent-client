package net.progruzovik.dissent.captain;

import net.progruzovik.dissent.battle.model.Battle;
import net.progruzovik.dissent.battle.model.Side;
import net.progruzovik.dissent.battle.model.Unit;
import net.progruzovik.dissent.model.entity.Ship;
import net.progruzovik.dissent.socket.model.Message;

import java.util.List;

public interface Captain {

    String getId();

    List<Ship> getShips();

    Battle getBattle();

    void addToBattle(Side side, Battle battle);

    void act(Unit unit);

    <T> void sendMessage(Message<T> message);
}
