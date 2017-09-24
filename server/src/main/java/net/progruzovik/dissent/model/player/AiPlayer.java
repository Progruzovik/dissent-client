package net.progruzovik.dissent.model.player;

import net.progruzovik.dissent.dao.HullDao;
import net.progruzovik.dissent.model.battle.Unit;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

@Component
@Scope(ConfigurableBeanFactory.SCOPE_PROTOTYPE)
public final class AiPlayer extends AbstractPlayer {

    public AiPlayer(HullDao shipDao) {
        getUnits().add(new Unit(shipDao.getHull(3), null, null));
    }

    @Override
    public String getId() {
        return "AI_PLAYER";
    }
}
