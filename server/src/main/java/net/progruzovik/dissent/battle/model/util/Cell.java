package net.progruzovik.dissent.battle.model.util;

import org.springframework.lang.NonNull;

public final class Cell extends Point<Integer> {

    public Cell(@NonNull Integer x, @NonNull Integer y) {
        super(x, y);
    }

    public Cell(@NonNull Cell cell) {
        super(cell);
    }

    public Cell() { super(0, 0); }

    public double distanceTo(@NonNull Cell cell) {
        final int dx = cell.getX() - getX();
        final int dy = cell.getY() - getY();
        return Math.sqrt(dx * dx + dy * dy);
    }

    @NonNull
    public Point<Float> findCenter(Cell destination) {
        return new Point<>(getX().floatValue() + (destination.getX().floatValue() - getX().floatValue()) / 2,
                getY().floatValue() + (destination.getY().floatValue() - getY().floatValue()) / 2);
    }
}
