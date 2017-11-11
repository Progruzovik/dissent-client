package net.progruzovik.dissent.battle;

import net.progruzovik.dissent.battle.player.AiCaptain;
import net.progruzovik.dissent.battle.player.Captain;
import net.progruzovik.dissent.model.battle.Battle;
import org.springframework.beans.factory.ObjectFactory;
import org.springframework.stereotype.Service;

@Service
public final class ScenarioDigestService implements ScenarioDigest {

    private final ObjectFactory<AiCaptain> aiCaptainFactory;

    public ScenarioDigestService(ObjectFactory<AiCaptain> aiCaptainFactory) {
        this.aiCaptainFactory = aiCaptainFactory;
    }

    @Override
    public void start(Captain captain) {
        new Battle(captain, aiCaptainFactory.getObject());
    }
}
