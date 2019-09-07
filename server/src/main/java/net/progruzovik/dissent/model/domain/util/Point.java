package net.progruzovik.dissent.model.domain.util;

import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;

public class Point<T> {

    private @NonNull T x;
    private @NonNull T y;

    Point(@NonNull T x, @NonNull T y) {
        this.x = x;
        this.y = y;
    }

    Point(Point<T> point) {
        x = point.x;
        y = point.y;
    }

    @NonNull
    public T getX() {
        return x;
    }

    public void setX(@NonNull T x) {
        this.x = x;
    }

    @NonNull
    public T getY() {
        return y;
    }

    public void setY(@NonNull T y) {
        this.y = y;
    }

    @Override
    public boolean equals(@Nullable Object obj) {
        if (obj == null || getClass() != obj.getClass()) return false;
        final Cell cell = (Cell) obj;
        return getX().equals(cell.getX()) && getY().equals(cell.getY());
    }

    @NonNull
    @Override
    public String toString() {
        return String.format("[%s; %s]", x.toString(), y.toString());
    }
}
