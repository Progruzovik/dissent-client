package net.progruzovik.dissent.model.battle;

import net.progruzovik.dissent.model.util.Cell;

public final class Action {

    private final ActionType type;
    private final Cell cell;

    public Action(ActionType type, Cell cell) {
        this.type = type;
        this.cell = cell;
    }

    public Action(ActionType type) {
        this.type = type;
        cell = null;
    }

    public ActionType getType() {
        return type;
    }

    public Cell getCell() {
        return cell;
    }
}
