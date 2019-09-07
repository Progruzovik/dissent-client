package net.progruzovik.dissent.exception;

import net.progruzovik.dissent.model.domain.battle.Unit;
import org.springframework.lang.NonNull;

public final class InvalidUnitException extends RuntimeException {

    public InvalidUnitException(@NonNull Unit unit) {
        super(String.format("Can't activate unit on cell %s!", unit.getFirstCell()));
    }
}
