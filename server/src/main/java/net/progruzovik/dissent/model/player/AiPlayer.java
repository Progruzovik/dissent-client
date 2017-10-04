package net.progruzovik.dissent.model.player;

import net.progruzovik.dissent.battle.Battle;
import net.progruzovik.dissent.dao.GunDao;
import net.progruzovik.dissent.dao.HullDao;
import net.progruzovik.dissent.model.battle.Unit;
import net.progruzovik.dissent.model.battle.action.Action;
import net.progruzovik.dissent.model.entity.Gun;
import net.progruzovik.dissent.model.entity.Hull;
import net.progruzovik.dissent.model.util.Cell;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@Scope(ConfigurableBeanFactory.SCOPE_PROTOTYPE)
public final class AiPlayer implements Player {

    private final List<Unit> units = new ArrayList<>();
    private Battle battle;

    public AiPlayer(HullDao hullDao, GunDao gunDao) {
        final Hull aiHull = hullDao.getHull(3);
        final Gun shrapnel = gunDao.getGun(1);
        units.add(new Unit(aiHull, shrapnel, null));
        units.add(new Unit(aiHull, shrapnel, null));
    }

    @Override
    public String getId() {
        return "AI_PLAYER";
    }

    @Override
    public List<Unit> getUnits() {
        return units;
    }

    @Override
    public Battle getBattle() {
        return battle;
    }

    @Override
    public void setBattle(Battle battle) {
        this.battle = battle;
    }

    @Override
    public void newAction(int number, Action action) { }

    public void act() {
        final Unit currentUnit = getBattle().getUnitQueue().getCurrentUnit();
        if (currentUnit.getFirstGun() != null) {
            final List<Cell> targetCells =  getBattle().getField()
                    .findShotAndTargetCells(currentUnit.getFirstGunId(), currentUnit).get("targetCells");
            if (!targetCells.isEmpty()) {
                getBattle().shootWithCurrentUnit(getId(), currentUnit.getFirstGunId(), targetCells.get(0));
            }
        }
        getBattle().endTurn(getId());
    }
}
