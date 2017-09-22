package net.progruzovik.dissent.battle;

import net.progruzovik.dissent.model.battle.Field;
import net.progruzovik.dissent.model.Gun;
import net.progruzovik.dissent.model.Hull;
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

    Set<Hull> getUniqueHulls();

    Set<Gun> getUniqueGuns();

    Side getPlayerSide(String playerId);

    List<Cell> findReachableCellsForCurrentUnit();

    boolean moveCurrentUnit(String playerId, Cell cell);

    boolean prepareCurrentUnitGun(String playerId, int gunNumber);

    Map<String, List<Cell>> findCellsForCurrentUnitShot();

    boolean shootByCurrentUnit(String playerId, Cell cell);

    boolean nextTurn(String playerId);
}
