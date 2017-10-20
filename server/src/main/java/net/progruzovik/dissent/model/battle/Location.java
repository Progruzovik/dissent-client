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
