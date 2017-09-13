package net.progruzovik.dissent.player;

import net.progruzovik.dissent.model.Ship;
import net.progruzovik.dissent.model.Unit;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

@Component
@Scope(ConfigurableBeanFactory.SCOPE_PROTOTYPE)
public final class AiPlayer extends AbstractPlayer {

    public AiPlayer() {
        getUnits().add(new Unit(new Ship(0, "ship-4-2")));
    }
}
