package net.progruzovik.dissent.model.event;

public enum EventSubject {

    NEW_TURN_START,

    MOVE,
    SHOT,
    NEXT_TURN,
    BATTLE_FINISH;

    public boolean isPublic() {
        return this != NEW_TURN_START;
    }
}
