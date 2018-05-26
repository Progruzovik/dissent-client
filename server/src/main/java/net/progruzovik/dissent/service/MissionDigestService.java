package net.progruzovik.dissent.service;

import net.progruzovik.dissent.battle.BattleCreator;
import net.progruzovik.dissent.captain.AiCaptain;
import net.progruzovik.dissent.captain.Captain;
import org.springframework.beans.factory.ObjectFactory;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public final class MissionDigestService implements MissionDigest {

    private final List<String> missions = new ArrayList<>(1);

    private final ObjectFactory<AiCaptain> aiCaptainFactory;
    private final BattleCreator battleCreator;

    public MissionDigestService(ObjectFactory<AiCaptain> aiCaptainFactory, BattleCreator battleCreator) {
        missions.add("testMission");

        this.aiCaptainFactory = aiCaptainFactory;
        this.battleCreator = battleCreator;
    }

    @Override
    public List<String> getMissions() {
        return missions;
    }

    @Override
    public void startMission(Captain captain, int missionIndex) {
        if (missionIndex >= missions.size()) throw new NonexistentMissionException(missionIndex);
        battleCreator.createBattle(captain, aiCaptainFactory.getObject());
    }
}
