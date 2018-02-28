package net.progruzovik.dissent.battle.model.util;

public class Point<T> {

    private T x;
    private T y;

    Point(T x, T y) {
        this.x = x;
        this.y = y;
    }

    Point(Point<T> point) {
        x = point.x;
        y = point.y;
    }

    Point() { }

    public T getX() {
        return x;
    }

    public void setX(T x) {
        this.x = x;
    }

    public T getY() {
        return y;
    }

    public void setY(T y) {
        this.y = y;
    }

    @Override
    public boolean equals(Object obj) {
        if (getClass() != obj.getClass()) return false;
        final Cell cell = (Cell) obj;
        return getX().equals(cell.getX()) && getY().equals(cell.getY());
    }

    @Override
    public String toString() {
        return String.format("[%s; %s]", x.toString(), y.toString());
    }
}
