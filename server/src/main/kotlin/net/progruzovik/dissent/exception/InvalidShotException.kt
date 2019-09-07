package net.progruzovik.dissent.exception

import net.progruzovik.dissent.model.domain.util.Cell

class InvalidShotException(cell: Cell) : AbstractBattleException("There is no target on cell $cell")
