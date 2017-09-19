package net.progruzovik.dissent.model.player;

import net.progruzovik.dissent.dao.ShipDao;
import net.progruzovik.dissent.model.Unit;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

@Component
@Scope(ConfigurableBeanFactory.SCOPE_PROTOTYPE)
public final class AiPlayer extends AbstractPlayer {

    public AiPlayer(ShipDao shipDao) {
        getUnits().add(new Unit(shipDao.getShip(3), null, null));
    }
}
