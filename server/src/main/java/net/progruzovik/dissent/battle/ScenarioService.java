package net.progruzovik.dissent.battle;

import net.progruzovik.dissent.dao.ShipDao;
import net.progruzovik.dissent.player.AiPlayer;
import net.progruzovik.dissent.player.Player;
import org.springframework.beans.factory.ObjectFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

@Service
public final class ScenarioService implements Scenario {

    private final Player player;

    private final ShipDao shipDao;
    private final FieldFactory fieldFactory;
    private final ObjectFactory<AiPlayer> aiPlayerFactory;

    public ScenarioService(@Qualifier("sessionPlayer") Player player, ShipDao shipDao,
                           FieldFactory fieldFactory, ObjectFactory<AiPlayer> aiPlayerFactory) {
        this.player = player;
        this.shipDao = shipDao;
        this.fieldFactory = fieldFactory;
        this.aiPlayerFactory = aiPlayerFactory;
    }

    @Override
    public void start() {
        final Player aiPlayer = aiPlayerFactory.getObject();
        final Field field = fieldFactory.create(player, aiPlayer, shipDao);
        player.setField(field);
        aiPlayer.setField(field);
    }
}
