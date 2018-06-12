package net.progruzovik.dissent.captain;

import net.progruzovik.dissent.battle.model.Battle;
import net.progruzovik.dissent.battle.model.Unit;
import net.progruzovik.dissent.battle.model.field.gun.GunCells;
import net.progruzovik.dissent.dao.GunDao;
import net.progruzovik.dissent.dao.HullDao;
import net.progruzovik.dissent.model.Message;
import net.progruzovik.dissent.model.entity.Gun;
import net.progruzovik.dissent.model.entity.Hull;
import net.progruzovik.dissent.model.entity.Ship;
import net.progruzovik.dissent.battle.model.util.Cell;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Observable;
import java.util.Random;

@Component
@Scope("prototype")
public final class AiCaptain extends AbstractCaptain {

    public AiCaptain(HullDao hullDao, GunDao gunDao) {
        final Hull aiHull = hullDao.getHull(6);
        final Gun artillery = gunDao.getGun(2);
        getShips().add(new Ship(aiHull, artillery, null));
        getShips().add(new Ship(hullDao.getHull(4), gunDao.getGun(3), null));
        getShips().add(new Ship(aiHull, artillery, null));
    }

    @Override
    public String getId() {
        return "AI_CAPTAIN";
    }

    @Override
    public void update(Observable observable, Object data) {
        if (getBattle().isIdBelongsToCurrentCaptain(getId())) {
            final Message<?> message = (Message<?>) data;
            if (message.getSubject().equals(Battle.TIME_TO_ACT)) {
                final Unit unit = getBattle().getCurrentUnit();
                if (unit.getShip().getFirstGun() != null) {
                    boolean canCurrentUnitMove = true;
                    while (unit.getActionPoints() >= unit.getShip().getFirstGun().getShotCost()
                            && canCurrentUnitMove) {
                        final int firstGunId = unit.getShip().getFirstGun().getId();
                        final GunCells gunCells = getBattle().getGunCells(firstGunId);
                        if (gunCells.getTargets().isEmpty()) {
                            final List<Cell> reachableCells = getBattle().getReachableCells();
                            if (reachableCells.isEmpty()) {
                                canCurrentUnitMove = false;
                            } else {
                                final Random random = new Random();
                                getBattle().moveCurrentUnit(getId(),
                                        reachableCells.get(random.nextInt(reachableCells.size())));
                            }
                        } else {
                            getBattle().shootWithCurrentUnit(getId(), firstGunId, gunCells.getTargets().get(0).getCell());
                        }
                    }
                }
                getBattle().endTurn(getId());
            }
        }
    }
}
