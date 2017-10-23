package net.progruzovik.dissent.model.battle;

final class Location {

    private LocationStatus currentStatus;
    private final LocationStatus defaultStatus;

    Location(LocationStatus defaultStatus) {
        currentStatus = defaultStatus;
        this.defaultStatus = defaultStatus;
    }

    Location() {
        this(LocationStatus.EMPTY);
    }

    int getMovementCost() {
        switch (defaultStatus) {
            case ASTEROID: return 1048576;
            case CLOUD: return 2;
            default: return 1;
        }
    }

    LocationStatus getCurrentStatus() {
        return currentStatus;
    }

    void setCurrentStatus(LocationStatus currentStatus) {
        this.currentStatus = currentStatus;
    }

    void resetStatusToDefault() {
        currentStatus = defaultStatus;
    }
}
