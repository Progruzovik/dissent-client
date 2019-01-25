package net.progruzovik.dissent.captain;

import net.progruzovik.dissent.battle.model.Unit;
import net.progruzovik.dissent.battle.model.field.gun.GunCells;
import net.progruzovik.dissent.battle.model.util.Cell;
import net.progruzovik.dissent.model.entity.Gun;
import net.progruzovik.dissent.model.entity.Hull;
import net.progruzovik.dissent.model.entity.Ship;
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
        final Hull aiHull = hullRepository.findById(6).get();
        final Gun artillery = gunRepository.findById(2).get();
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
    public void onEvent(Event<?> event) {
        if (event.getSubject().equals(EventSubject.NEW_TURN_START)
                && getBattle() != null && getBattle().isIdBelongsToCurrentCaptain(getId())) {
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
                        getBattle()
                                .shootWithCurrentUnit(getId(), firstGunId, gunCells.getTargets().get(0).getCell());
                    }
                }
            }
            getBattle().endTurn(getId());
        }
    }
}
