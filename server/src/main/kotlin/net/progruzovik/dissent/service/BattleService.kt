package net.progruzovik.dissent.service

import net.progruzovik.dissent.captain.Captain
import net.progruzovik.dissent.model.domain.battle.Battle
import net.progruzovik.dissent.model.domain.battle.Side
import net.progruzovik.dissent.model.domain.battle.UnitQueue
import net.progruzovik.dissent.model.domain.battle.field.Field
import net.progruzovik.dissent.model.domain.util.Cell
import org.springframework.stereotype.Service
import kotlin.math.max

@Service
class BattleService {

    fun createBattle(leftCaptain: Captain, rightCaptain: Captain) {
        val maxShipsOnSide = max(leftCaptain.ships.size, rightCaptain.ships.size)
        val rowsCount = maxShipsOnSide + (maxShipsOnSide - 1) * Field.UNIT_INDENT + Field.BORDER_INDENT * 2
        val field = Field(Cell((rowsCount * 1.5).toInt(), rowsCount))
        val battle = Battle(UnitQueue(), field, leftCaptain, rightCaptain)
        leftCaptain.addToBattle(battle, Side.LEFT)
        rightCaptain.addToBattle(battle, Side.RIGHT)
        battle.startBattle()
    }
}
