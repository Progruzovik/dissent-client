package net.progruzovik.dissent.battle;

import net.progruzovik.dissent.model.battle.Field;
import net.progruzovik.dissent.model.battle.Side;
import net.progruzovik.dissent.model.battle.UnitQueue;
import net.progruzovik.dissent.model.util.Cell;

public interface Battle {

    UnitQueue getUnitQueue();

    Field getField();

    Side getPlayerSide(String playerId);

    boolean moveCurrentUnit(String playerId, Cell cell);

    boolean shootWithCurrentUnit(String playerId, int gunId, Cell cell);

    boolean endTurn(String playerId);
}
