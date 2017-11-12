package net.progruzovik.dissent.battle.captain;

import net.progruzovik.dissent.model.battle.Battle;
import net.progruzovik.dissent.model.battle.Side;
import net.progruzovik.dissent.model.battle.Unit;
import net.progruzovik.dissent.model.entity.Ship;
import net.progruzovik.dissent.model.socket.Message;

import java.util.List;

public interface Captain {

    String getId();

    List<Ship> getShips();

    void setStatus(Status status);

    Battle getBattle();

    void registerBattle(Side side, Battle battle);

    void act(Unit unit);

    void sendMessage(Message message);
}
