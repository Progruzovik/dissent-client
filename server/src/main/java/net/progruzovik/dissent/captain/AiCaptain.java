package net.progruzovik.dissent.captain;

import net.progruzovik.dissent.battle.model.Unit;
import net.progruzovik.dissent.battle.model.field.gun.GunCells;
import net.progruzovik.dissent.battle.model.util.Cell;
import net.progruzovik.dissent.model.entity.GunEntity;
import net.progruzovik.dissent.model.entity.HullEntity;
import net.progruzovik.dissent.model.domain.Ship;
import net.progruzovik.dissent.model.event.Event;
import net.progruzovik.dissent.model.event.EventSubject;
import net.progruzovik.dissent.repository.GunRepository;
import net.progruzovik.dissent.repository.HullRepository;
import org.springframework.context.annotation.Scope;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Random;

@Component
@Scope("prototype")
public final class AiCaptain extends AbstractCaptain {

    public AiCaptain(HullRepository hullRepository, GunRepository gunRepository) {
        HullEntity aiHull = hullRepository.findById(6).get();
        GunEntity artillery = gunRepository.findById(2).get();
        getShips().add(new Ship(aiHull, artillery, null));
        getShips().add(new Ship(hullRepository.findById(4).get(), gunRepository.findById(3).get(), null));
        getShips().add(new Ship(aiHull, artillery, null));
    }

    @NonNull
    @Override
    public String getId() {
        return "AI_CAPTAIN";
    }

    @Override
    public void accept(Event<?> event) {
        if (event.getSubject().equals(EventSubject.NEW_TURN_START)
                && getBattle() != null && getBattle().isIdBelongsToCurrentCaptain(getId())) {
            Unit unit = getBattle().getCurrentUnit();
            if (unit.getShip().getFirstGun() != null) {
                boolean canCurrentUnitMove = true;
                while (unit.getActionPoints() >= unit.getShip().getFirstGun().getShotCost()
                        && canCurrentUnitMove) {
                    int firstGunId = unit.getShip().getFirstGun().getId();
                    GunCells gunCells = getBattle().getGunCells(firstGunId);
                    if (gunCells.getTargets().isEmpty()) {
                        List<Cell> reachableCells = getBattle().getReachableCells();
                        if (reachableCells.isEmpty()) {
                            canCurrentUnitMove = false;
                        } else {
                            Random random = new Random();
                            getBattle().moveCurrentUnit(getId(), reachableCells.get(random.nextInt(reachableCells.size())));
                        }
                    } else {
                        getBattle().shootWithCurrentUnit(getId(), firstGunId, gunCells.getTargets().get(0).getCell());
                    }
                }
            }
            endTurn();
        }
    }
}
