package net.progruzovik.dissent.battle;

import net.progruzovik.dissent.model.Ship;
import net.progruzovik.dissent.model.Unit;
import net.progruzovik.dissent.player.Player;
import net.progruzovik.dissent.util.Point;

import java.util.List;
import java.util.Queue;

public interface Field {

    Point getSize();

    List<Ship> getShips();

    int getTurnNumber();

    Unit getCurrentUnit();

    Queue<Unit> getQueue();

    Side getPlayerSide(Player player);

    boolean moveCurrentUnit(Player player, Point cell);

    boolean nextTurn(Player player);
}
