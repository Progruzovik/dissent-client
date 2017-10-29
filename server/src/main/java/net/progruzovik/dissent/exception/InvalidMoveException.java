package net.progruzovik.dissent.exception;

import net.progruzovik.dissent.model.util.Cell;

public final class InvalidMoveException extends RuntimeException {

    public InvalidMoveException(int actionPoints, Cell fromCell, Cell toCell) {
        super(String.format("Can't move unit with %d action points from cell (%d; %d) to cell (%d; %d)",
                actionPoints, fromCell.getX(), fromCell.getY(), toCell.getX(), toCell.getY()));
    }
}
