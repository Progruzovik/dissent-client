package net.progruzovik.dissent.captain

import net.progruzovik.dissent.model.domain.Ship
import net.progruzovik.dissent.model.domain.battle.Battle
import net.progruzovik.dissent.model.domain.battle.Side
import net.progruzovik.dissent.model.event.Event
import java.util.function.Consumer

interface Captain : Consumer<Event<*>> {

    val id: String

    val ships: List<Ship>

    val battle: Battle?

    fun addToBattle(battle: Battle, side: Side)

    fun endTurn()
}
