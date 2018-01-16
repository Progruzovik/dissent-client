package net.progruzovik.dissent.battle.exception;

import net.progruzovik.dissent.battle.model.Unit;

public final class InvalidUnitException extends RuntimeException {

    public InvalidUnitException(Unit unit) {
        super(String.format("Can't activate unit on cell %s!", unit.getFirstCell()));
    }
}
