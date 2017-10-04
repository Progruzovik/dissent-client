package net.progruzovik.dissent.battle;

import net.progruzovik.dissent.model.battle.Field;
import net.progruzovik.dissent.model.battle.Side;
import net.progruzovik.dissent.model.battle.UnitQueue;
import net.progruzovik.dissent.model.battle.action.Action;
import net.progruzovik.dissent.model.battle.action.Move;
import net.progruzovik.dissent.model.battle.action.Shot;
import net.progruzovik.dissent.model.util.Cell;

import java.util.List;
import java.util.Map;

public interface Battle {

    UnitQueue getUnitQueue();

    Field getField();

    Side getPlayerSide(String playerId);

    Action getAction(int number);

    int getActionsCount();

    Move getMove(int number);

    Shot getShot(int number);

    List<Cell> findReachableCellsForCurrentUnit();

    boolean moveCurrentUnit(String playerId, Cell cell);

    Map<String, List<Cell>> findCellsForCurrentUnitShot(int gunId);

    boolean shootWithCurrentUnit(String playerId, int gunId, Cell cell);

    boolean endTurn(String playerId);
}
