package net.progruzovik.dissent.player;

import net.progruzovik.dissent.battle.Field;
import net.progruzovik.dissent.model.Unit;

import java.util.List;

public interface Player {

    List<Unit> getUnits();

    Field getField();

    void setField(Field field);
}
