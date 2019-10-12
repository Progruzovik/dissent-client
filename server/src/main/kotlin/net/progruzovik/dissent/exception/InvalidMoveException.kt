package net.progruzovik.dissent.exception

import net.progruzovik.dissent.model.domain.util.Cell

class InvalidMoveException(
    actionPoints: Int,
    fromCell: Cell,
    toCell: Cell
) : AbstractBattleException("Can't move unit with $actionPoints AP from cell $fromCell to cell $toCell")
