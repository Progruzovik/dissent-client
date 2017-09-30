package net.progruzovik.dissent.model.battle.action;

public final class Action {

    private final int number;
    private final ActionType type;

    public Action(int number, ActionType type) {
        this.number = number;
        this.type = type;
    }

    public Action(ActionType type) {
        number = 0;
        this.type = type;
    }

    public int getNumber() {
        return number;
    }

    public ActionType getType() {
        return type;
    }
}
