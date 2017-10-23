package net.progruzovik.dissent.exception;

import net.progruzovik.dissent.model.util.Cell;

public final class InvalidMoveException extends RuntimeException {

    public InvalidMoveException(int actionPoints, int distance, Cell fromCell, Cell toCell) {
        super(String.format("Can't move unit with %d action points on distance %d from cell (%d; %d) to cell (%d; %d)",
                actionPoints, distance, fromCell.getX(), fromCell.getY(), toCell.getX(), toCell.getY()));
    }
}
