package net.progruzovik.dissent.battle;

import net.progruzovik.dissent.model.Gun;
import net.progruzovik.dissent.model.Ship;
import net.progruzovik.dissent.model.Unit;
import net.progruzovik.dissent.model.player.Player;
import net.progruzovik.dissent.model.util.Point;

import java.util.List;
import java.util.Queue;
import java.util.Set;

public interface Field {

    Point getSize();

    int getTurnNumber();

    List<List<Point>> getCurrentPaths();

    List<Point> getCurrentReachableCells();

    List<Point> getAsteroids();

    Unit getCurrentUnit();

    Queue<Unit> getUnitQueue();

    Set<Ship> getUniqueShips();

    Set<Gun> getUniqueGuns();

    Side getPlayerSide(Player player);

    boolean moveCurrentUnit(Player player, Point cell);

    boolean nextTurn(Player player);
}
