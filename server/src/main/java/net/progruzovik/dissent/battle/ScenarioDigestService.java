package net.progruzovik.dissent.battle;

import net.progruzovik.dissent.battle.captain.AiCaptain;
import net.progruzovik.dissent.battle.captain.Captain;
import org.springframework.beans.factory.ObjectFactory;
import org.springframework.stereotype.Service;

@Service
public final class ScenarioDigestService implements ScenarioDigest {

    private final ObjectFactory<AiCaptain> aiCaptainFactory;
    private final BattleFactory battleFactory;

    public ScenarioDigestService(ObjectFactory<AiCaptain> aiCaptainFactory, BattleFactory battleFactory) {
        this.aiCaptainFactory = aiCaptainFactory;
        this.battleFactory = battleFactory;
    }

    @Override
    public void start(Captain captain) {
        battleFactory.createBattle(captain, aiCaptainFactory.getObject());
    }
}
