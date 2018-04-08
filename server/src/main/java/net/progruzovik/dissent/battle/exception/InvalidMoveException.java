package net.progruzovik.dissent.battle.exception;

import net.progruzovik.dissent.battle.model.util.Cell;
import org.springframework.lang.NonNull;

public final class InvalidMoveException extends RuntimeException {

    public InvalidMoveException(int actionPoints, @NonNull Cell fromCell, @NonNull Cell toCell) {
        super(String.format("Can't move unit with %d action points from cell %s to cell %s",
                actionPoints, fromCell, toCell));
    }
}
