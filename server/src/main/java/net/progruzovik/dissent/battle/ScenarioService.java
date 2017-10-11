package net.progruzovik.dissent.battle;

import net.progruzovik.dissent.model.player.AiPlayer;
import net.progruzovik.dissent.model.player.Player;
import org.springframework.beans.factory.ObjectFactory;
import org.springframework.stereotype.Service;

@Service
public final class ScenarioService implements Scenario {

    private final BattleFactory battleFactory;
    private final ObjectFactory<AiPlayer> aiPlayerFactory;

    public ScenarioService(BattleFactory battleFactory, ObjectFactory<AiPlayer> aiPlayerFactory) {
        this.battleFactory = battleFactory;
        this.aiPlayerFactory = aiPlayerFactory;
    }

    @Override
    public void start(Player player) {
        battleFactory.create(player, aiPlayerFactory.getObject());
    }
}
