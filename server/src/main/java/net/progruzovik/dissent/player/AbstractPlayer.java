package net.progruzovik.dissent.player;

import net.progruzovik.dissent.battle.Field;
import net.progruzovik.dissent.model.Unit;

import java.util.ArrayList;
import java.util.List;

public abstract class AbstractPlayer implements Player {

    private Field field;
    private final List<Unit> units = new ArrayList<>();

    @Override
    public Field getField() {
        return field;
    }

    @Override
    public void setField(Field field) {
        this.field = field;
    }

    @Override
    public List<Unit> getUnits() {
        return units;
    }
}
