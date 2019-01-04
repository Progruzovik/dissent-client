package net.progruzovik.dissent.service;

import net.progruzovik.dissent.captain.Captain;
import org.springframework.lang.NonNull;

public interface MissionDigest {

    void startMission(@NonNull Captain captain, int missionIndex);
}
