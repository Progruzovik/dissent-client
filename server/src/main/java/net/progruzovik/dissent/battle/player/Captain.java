package net.progruzovik.dissent.battle.player;

import net.progruzovik.dissent.model.battle.Battle;
import net.progruzovik.dissent.model.entity.Ship;
import net.progruzovik.dissent.model.socket.Message;

import java.util.List;

public interface Captain {

    String getId();

    List<Ship> getShips();

    void setStatus(Status status);

    Battle getBattle();

    void setBattle(Battle battle);

    void act();

    void send(Message message);
}
