package net.progruzovik.dissent.captain;

import net.progruzovik.dissent.battle.model.Battle;
import net.progruzovik.dissent.battle.model.Side;
import net.progruzovik.dissent.battle.model.Unit;
import net.progruzovik.dissent.captain.model.Fleet;
import net.progruzovik.dissent.socket.model.Message;

public interface Captain {

    String getId();

    Fleet getFleet();

    Battle getBattle();

    void addToBattle(Side side, Battle battle);

    void act(Unit unit);

    void sendMessage(Message message);
}
