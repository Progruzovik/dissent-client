package net.progruzovik.dissent.battle.exception;

import net.progruzovik.dissent.battle.model.Unit;
import org.springframework.lang.NonNull;

public final class InvalidUnitException extends RuntimeException {

    public InvalidUnitException(@NonNull Unit unit) {
        super(String.format("Can't activate unit on cell %s!", unit.getFirstCell()));
    }
}
