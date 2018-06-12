package net.progruzovik.dissent.battle.model.field.map;

public enum LocationStatus {
    EMPTY,
    UNIT_LEFT,
    UNIT_RIGHT,
    UNIT_DESTROYED,
    ASTEROID,
    CLOUD;

    public boolean isFree() {
        return this == EMPTY || this == CLOUD;
    }
}
