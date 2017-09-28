package net.progruzovik.dissent.battle;

import net.progruzovik.dissent.model.battle.Action;
import net.progruzovik.dissent.model.battle.Field;
import net.progruzovik.dissent.model.battle.Side;
import net.progruzovik.dissent.model.battle.UnitQueue;
import net.progruzovik.dissent.model.util.Cell;

import java.util.List;
import java.util.Map;

public interface Battle {

    int getActionsCount();

    UnitQueue getUnitQueue();

    Field getField();

    Side getPlayerSide(String playerId);

    List<Action> getActions(int fromIndex);

    List<Cell> findReachableCellsForCurrentUnit();

    boolean moveCurrentUnit(String playerId, Cell cell);

    boolean prepareCurrentUnitGun(String playerId, int gunNumber);

    Map<String, List<Cell>> findCellsForCurrentUnitShot();

    boolean shootWithCurrentUnit(String playerId, Cell cell);

    boolean nextTurn(String playerId);
}
