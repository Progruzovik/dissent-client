package net.progruzovik.dissent.battle.model.field.location;

import org.springframework.lang.NonNull;

final class Location {

    private static final int IMPOSSIBLE_MOVEMENT_COST = 1048576;

    private @NonNull LocationStatus currentStatus;
    private final @NonNull LocationStatus defaultStatus;

    Location(@NonNull LocationStatus defaultStatus) {
        currentStatus = defaultStatus;
        this.defaultStatus = defaultStatus;
    }

    Location() {
        this(LocationStatus.EMPTY);
    }

    int getMovementCost() {
        switch (defaultStatus) {
            case ASTEROID: return IMPOSSIBLE_MOVEMENT_COST;
            default: return 1;
        }
    }

    @NonNull
    LocationStatus getCurrentStatus() {
        return currentStatus;
    }

    void setCurrentStatus(@NonNull LocationStatus currentStatus) {
        this.currentStatus = currentStatus;
    }

    void resetStatusToDefault() {
        currentStatus = defaultStatus;
    }
}
