package net.progruzovik.dissent.battle.model.field.location;

import org.springframework.lang.NonNull;

final class Location {

    private static final int IMPOSSIBLE_MOVEMENT_COST = Integer.MAX_VALUE / 2;

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
        if (defaultStatus == LocationStatus.ASTEROID) return IMPOSSIBLE_MOVEMENT_COST;
        return 1;
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
