package net.progruzovik.dissent.battle.exception;

import net.progruzovik.dissent.battle.model.util.Cell;

public final class EmptyCellException extends RuntimeException {

    public EmptyCellException(Cell cell) {
        super(String.format("Can't find unit on cell %s!", cell));
    }
}
