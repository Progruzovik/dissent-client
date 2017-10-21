package net.progruzovik.dissent.model.player;

import net.progruzovik.dissent.battle.Battle;
import net.progruzovik.dissent.model.entity.Ship;
import net.progruzovik.dissent.model.socket.ServerMessage;

import java.util.List;

public interface Captain {

    String getId();

    List<Ship> getShips();

    void setStatus(Status status);

    Battle getBattle();

    void setBattle(Battle battle);

    void act();

    void send(ServerMessage message);
}
