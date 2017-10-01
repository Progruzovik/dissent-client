package net.progruzovik.dissent.model.player;

import net.progruzovik.dissent.dao.HullDao;
import net.progruzovik.dissent.model.entity.Hull;
import net.progruzovik.dissent.model.battle.Unit;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

@Component
@Scope(ConfigurableBeanFactory.SCOPE_PROTOTYPE)
public final class AiPlayer extends AbstractPlayer {

    public AiPlayer(HullDao hullDao) {
        final Hull hull = hullDao.getHull(3);
        getUnits().add(new Unit(hull, null, null));
        getUnits().add(new Unit(hull, null, null));
    }

    @Override
    public String getId() {
        return "AI_PLAYER";
    }
}
