package net.progruzovik.dissent.service;

import net.progruzovik.dissent.captain.Captain;

import java.util.List;

public interface MissionDigest {

    List<String> getMissions();

    void startMission(Captain captain, int missionIndex);
}
