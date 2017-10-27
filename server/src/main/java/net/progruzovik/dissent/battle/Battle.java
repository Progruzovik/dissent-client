package net.progruzovik.dissent.battle;

import net.progruzovik.dissent.model.battle.field.Field;
import net.progruzovik.dissent.model.battle.Side;
import net.progruzovik.dissent.model.battle.UnitQueue;
import net.progruzovik.dissent.model.util.Cell;

public interface Battle {

    UnitQueue getUnitQueue();

    Field getField();

    Side getPlayerSide(String playerId);

    void moveCurrentUnit(String playerId, Cell cell);

    void shootWithCurrentUnit(String playerId, int gunId, Cell cell);

    void endTurn(String playerId);
}
