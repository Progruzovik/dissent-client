package net.progruzovik.dissent.battle;

import net.progruzovik.dissent.model.Field;
import net.progruzovik.dissent.model.Gun;
import net.progruzovik.dissent.model.Ship;
import net.progruzovik.dissent.model.Unit;
import net.progruzovik.dissent.model.player.Player;
import net.progruzovik.dissent.model.util.Cell;

import java.util.List;
import java.util.Map;
import java.util.Queue;
import java.util.Set;

public interface Battle {

    int getTurnNumber();

    Field getField();

    Queue<Unit> getUnitQueue();

    Unit getCurrentUnit();

    Set<Ship> getUniqueShips();

    Set<Gun> getUniqueGuns();

    Side getPlayerSide(Player player);

    List<Cell> findReachableCellsForCurrentUnit();

    boolean moveCurrentUnit(Player player, Cell cell);

    boolean prepareCurrentUnitGun(Player player, int gunNumber);

    Map<String, List<Cell>> findCellsForCurrentUnitShot();

    boolean shootByCurrentUnit(Player player, Cell cell);

    boolean nextTurn(Player player);
}
