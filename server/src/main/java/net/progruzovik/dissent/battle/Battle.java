package net.progruzovik.dissent.battle;

import net.progruzovik.dissent.model.battle.Field;
import net.progruzovik.dissent.model.battle.UnitQueue;
import net.progruzovik.dissent.model.util.Cell;

import java.util.List;
import java.util.Map;

public interface Battle {

    Field getField();

    UnitQueue getUnitQueue();

    Side getPlayerSide(String playerId);

    List<Cell> findReachableCellsForCurrentUnit();

    boolean moveCurrentUnit(String playerId, Cell cell);

    boolean prepareCurrentUnitGun(String playerId, int gunNumber);

    Map<String, List<Cell>> findCellsForCurrentUnitShot();

    boolean shootWithCurrentUnit(String playerId, Cell cell);

    boolean nextTurn(String playerId);
}
