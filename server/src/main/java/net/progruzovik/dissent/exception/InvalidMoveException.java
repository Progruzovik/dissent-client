package net.progruzovik.dissent.exception;

import net.progruzovik.dissent.model.util.Cell;

public final class InvalidMoveException extends RuntimeException {

    public InvalidMoveException(int movementPoints, Cell fromCell, Cell toCell) {
        super(String.format("Can't move unit with %d movement points from cell (%d; %d) to cell (%d; %d)",
                movementPoints, fromCell.getX(), fromCell.getY(), toCell.getX(), toCell.getY()));
    }
}
