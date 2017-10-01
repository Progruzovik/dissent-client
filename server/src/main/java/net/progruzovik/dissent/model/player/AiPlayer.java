package net.progruzovik.dissent.model.player;

import net.progruzovik.dissent.dao.GunDao;
import net.progruzovik.dissent.dao.HullDao;
import net.progruzovik.dissent.model.battle.Unit;
import net.progruzovik.dissent.model.entity.Gun;
import net.progruzovik.dissent.model.entity.Hull;
import net.progruzovik.dissent.model.util.Cell;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Scope(ConfigurableBeanFactory.SCOPE_PROTOTYPE)
public final class AiPlayer extends AbstractPlayer {

    public AiPlayer(HullDao hullDao, GunDao gunDao) {
        final Hull aiHull = hullDao.getHull(3);
        final Gun shrapnel = gunDao.getGun(1);
        getUnits().add(new Unit(aiHull, shrapnel, null));
        getUnits().add(new Unit(aiHull, shrapnel, null));
    }

    @Override
    public String getId() {
        return "AI_PLAYER";
    }

    public void act() {
        final Unit currentUnit = getBattle().getUnitQueue().getCurrentUnit();
        if (currentUnit.prepareGun(currentUnit.getFirstGunId())) {
            final List<Cell> targetCells =  getBattle().getField()
                    .findShotAndTargetCells(currentUnit).get("targetCells");
            if (!targetCells.isEmpty()) {
                getBattle().shootWithCurrentUnit(getId(), targetCells.get(0));
            }
        }
        getBattle().endTurn(getId());
    }
}
