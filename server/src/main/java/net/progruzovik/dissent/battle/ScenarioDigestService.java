package net.progruzovik.dissent.battle;

import net.progruzovik.dissent.model.player.AiCaptain;
import net.progruzovik.dissent.model.player.Captain;
import org.springframework.beans.factory.ObjectFactory;
import org.springframework.stereotype.Service;

@Service
public final class ScenarioDigestService implements ScenarioDigest {

    private final BattleFactory battleFactory;
    private final ObjectFactory<AiCaptain> aiPlayerFactory;

    public ScenarioDigestService(BattleFactory battleFactory, ObjectFactory<AiCaptain> aiPlayerFactory) {
        this.battleFactory = battleFactory;
        this.aiPlayerFactory = aiPlayerFactory;
    }

    @Override
    public void start(Captain captain) {
        battleFactory.create(captain, aiPlayerFactory.getObject());
    }
}
