package net.progruzovik.dissent.model.event

enum class EventName {

    NEW_TURN_START,

    MOVE,
    SHOT,
    NEXT_TURN,
    BATTLE_FINISH;

    val isPublicEvent: Boolean
        get() = this != NEW_TURN_START
}
