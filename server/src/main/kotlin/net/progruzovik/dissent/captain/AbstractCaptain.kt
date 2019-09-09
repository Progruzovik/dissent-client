package net.progruzovik.dissent.captain

import net.progruzovik.dissent.model.domain.Ship
import net.progruzovik.dissent.model.domain.battle.Battle
import net.progruzovik.dissent.model.domain.battle.Side

abstract class AbstractCaptain : Captain {

    override val ships = ArrayList<Ship>()
    override var battle: Battle? = null

    override fun addToBattle(battle: Battle, side: Side) {
        battle.addShips(side, ships)
        this.battle = battle
    }

    override fun endTurn() {
        battle?.endTurn(id)
    }
}
