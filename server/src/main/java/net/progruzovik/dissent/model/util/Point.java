package net.progruzovik.dissent.model.util;

public class Point<T> {

    private T x;
    private T y;

    public Point(T x, T y) {
        this.x = x;
        this.y = y;
    }

    public Point(Point<T> point) {
        x = point.x;
        y = point.y;
    }

    public Point() { }

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
}
