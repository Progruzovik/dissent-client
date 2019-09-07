package net.progruzovik.dissent.exception;

import net.progruzovik.dissent.model.domain.util.Cell;
import org.springframework.lang.NonNull;

public final class InvalidMoveException extends RuntimeException {

    public InvalidMoveException(int actionPoints, @NonNull Cell fromCell, @NonNull Cell toCell) {
        super(String.format("Can't move unit with %d action points from cell %s to cell %s",
                actionPoints, fromCell, toCell));
    }
}
