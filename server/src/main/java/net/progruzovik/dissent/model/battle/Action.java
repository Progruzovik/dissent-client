package net.progruzovik.dissent.model.battle;

import net.progruzovik.dissent.model.util.Cell;

public final class Action {

    private final ActionType type;
    private final Side playerSide;

    private final Cell firstCell;
    private final Cell secondCell;

    public Action(ActionType type, Side playerSide, Cell firstCell, Cell secondCell) {
        this.type = type;
        this.playerSide = playerSide;
        this.firstCell = firstCell;
        this.secondCell = secondCell;
    }

    public Action(ActionType type, Side playerSide) {
        this.type = type;
        this.playerSide = playerSide;
        firstCell = null;
        secondCell = null;
    }

    public ActionType getType() {
        return type;
    }

    public Side getPlayerSide() {
        return playerSide;
    }

    public Cell getFirstCell() {
        return firstCell;
    }

    public Cell getSecondCell() {
        return secondCell;
    }
}
