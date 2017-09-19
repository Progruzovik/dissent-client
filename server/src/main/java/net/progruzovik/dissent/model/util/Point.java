package net.progruzovik.dissent.model.util;

public final class Point {

    private int x;
    private int y;

    public Point(int x, int y) {
        this.x = x;
        this.y = y;
    }

    public Point() {}

    public int getX() {
        return x;
    }

    public int getY() {
        return y;
    }

    public boolean checkInBorders(Point borders) {
        return x > -1 && x < borders.x && y > -1 && y < borders.y;
    }

    public int calculateDistanceToCell(Point point) {
        return Math.abs(point.x - x) + Math.abs(point.y - y);
    }
}
