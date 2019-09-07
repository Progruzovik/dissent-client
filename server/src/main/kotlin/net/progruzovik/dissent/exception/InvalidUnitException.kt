package net.progruzovik.dissent.exception

import net.progruzovik.dissent.model.domain.battle.Unit

class InvalidUnitException(unit: Unit) : AbstractBattleException("Can't activate unit on cell ${unit.firstCell}!")
