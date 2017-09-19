package net.progruzovik.dissent.battle;

import net.progruzovik.dissent.model.Field;
import net.progruzovik.dissent.model.Gun;
import net.progruzovik.dissent.model.Ship;
import net.progruzovik.dissent.model.Unit;
import net.progruzovik.dissent.model.player.Player;
import net.progruzovik.dissent.model.util.Point;

import java.util.List;
import java.util.Queue;
import java.util.Set;

public interface Battle {

    int getTurnNumber();

    Field getField();

    Queue<Unit> getUnitQueue();

    Unit getCurrentUnit();

    List<Point> getCurrentUnitReachableCells();

    Set<Ship> getUniqueShips();

    Set<Gun> getUniqueGuns();

    Side getPlayerSide(Player player);

    boolean moveCurrentUnit(Player player, Point cell);

    boolean nextTurn(Player player);
}
