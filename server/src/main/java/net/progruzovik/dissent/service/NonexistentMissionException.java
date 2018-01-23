package net.progruzovik.dissent.service;

final class NonexistentMissionException extends RuntimeException {

    NonexistentMissionException(int missionIndex) {
        super(String.format("Mission #%d does not exist!", missionIndex));
    }
}
