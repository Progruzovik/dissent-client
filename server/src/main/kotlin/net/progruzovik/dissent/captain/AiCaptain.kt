package net.progruzovik.dissent.captain

import net.progruzovik.dissent.model.domain.Ship
import net.progruzovik.dissent.model.domain.battle.Battle
import net.progruzovik.dissent.model.entity.GunEntity
import net.progruzovik.dissent.model.entity.HullEntity
import net.progruzovik.dissent.model.event.Event
import net.progruzovik.dissent.model.event.EventName
import net.progruzovik.dissent.repository.GunRepository
import net.progruzovik.dissent.repository.HullRepository
import org.springframework.beans.factory.config.BeanDefinition
import org.springframework.context.annotation.Scope
import org.springframework.stereotype.Component

@Component
@Scope(BeanDefinition.SCOPE_PROTOTYPE)
class AiCaptain(hullRepository: HullRepository, gunRepository: GunRepository) : AbstractCaptain() {

    override val id = "AI_CAPTAIN_ID"

    init {
        val baseHull: HullEntity = hullRepository.findById(6).get()
        val artillery: GunEntity = gunRepository.findById(2).get()
        ships.add(Ship(baseHull, artillery, null))
        ships.add(Ship(hullRepository.findById(4).get(), gunRepository.findById(3).get(), null))
        ships.add(Ship(baseHull, artillery, null))
    }

    override fun accept(event: Event<*>) {
        val battle: Battle = this.battle ?: return
        if (event.name == EventName.NEW_TURN_START && battle.isIdBelongsToCurrentCaptain(id)) {
            if (battle.currentUnit.ship.firstGun != null) {
                var canCurrentUnitMove = true
                while (battle.currentUnit.actionPoints >= battle.currentUnit.ship.firstGun!!.shotCost && canCurrentUnitMove) {
                    val firstGunId = battle.currentUnit.ship.firstGun!!.id
                    val gunCells = battle.getGunCells(firstGunId)
                    if (gunCells.targets.isEmpty()) {
                        val reachableCells = battle.reachableCells
                        if (reachableCells.isEmpty()) {
                            canCurrentUnitMove = false
                        } else {
                            battle.moveCurrentUnit(id, reachableCells[(0 until reachableCells.size).random()])
                        }
                    } else {
                        battle.shootWithCurrentUnit(id, firstGunId, gunCells.targets[0].cell)
                    }
                }
            }
            endTurn()
        }
    }
}
