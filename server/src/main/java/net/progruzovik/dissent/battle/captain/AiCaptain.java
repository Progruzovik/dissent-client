package net.progruzovik.dissent.battle.captain;

import net.progruzovik.dissent.dao.GunDao;
import net.progruzovik.dissent.dao.HullDao;
import net.progruzovik.dissent.battle.model.Unit;
import net.progruzovik.dissent.battle.model.field.GunCells;
import net.progruzovik.dissent.model.entity.Gun;
import net.progruzovik.dissent.model.entity.Hull;
import net.progruzovik.dissent.model.entity.Ship;
import net.progruzovik.dissent.socket.model.Message;
import net.progruzovik.dissent.model.util.Cell;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Random;

@Component
@Scope("prototype")
public final class AiCaptain extends AbstractCaptain {

    public AiCaptain(HullDao hullDao, GunDao gunDao) {
        final Hull aiHull = hullDao.getHull(3);
        final Gun artillery = gunDao.getGun(2);
        getShips().add(new Ship(aiHull, artillery, null));
        getShips().add(new Ship(aiHull, artillery, null));
    }

    @Override
    public String getId() {
        return "AI_CAPTAIN";
    }

    @Override
    public void act(Unit unit) {
        if (unit.getShip().getFirstGun() != null) {
            boolean canCurrentUnitMove = true;
            while (unit.getActionPoints() >= unit.getShip().getFirstGun().getShotCost()
                    && canCurrentUnitMove) {
                final GunCells gunCells = getBattle().getGunCells(unit.getShip().getFirstGunId());
                if (gunCells.getTargetCells().isEmpty()) {
                    final List<Cell> reachableCells = getBattle().getReachableCells();
                    if (reachableCells.isEmpty()) {
                        canCurrentUnitMove = false;
                    } else {
                        final Random random = new Random();
                        getBattle().moveCurrentUnit(getId(),
                                reachableCells.get(random.nextInt(reachableCells.size())));
                    }
                } else {
                    getBattle().shootWithCurrentUnit(getId(),
                            unit.getShip().getFirstGunId(), gunCells.getTargetCells().get(0));
                }
            }
        }
        getBattle().endTurn(getId());
    }

    @Override
    public void sendMessage(Message message) { }
}
