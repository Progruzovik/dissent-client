package net.progruzovik.dissent.model.util;

public final class Cell {

    private int x;
    private int y;

    public Cell(int x, int y) {
        this.x = x;
        this.y = y;
    }

    public Cell(Cell cell) {
        x = cell.x;
        y = cell.y;
    }

    public Cell() {}

    public int getX() {
        return x;
    }

    public void setX(int x) {
        this.x = x;
    }

    public int getY() {
        return y;
    }

    public void setY(int y) {
        this.y = y;
    }

    public boolean isSame(Cell cell) {
        return x == cell.x && y == cell.y;
    }

    public boolean checkInBorders(Cell borders) {
        return x > -1 && x < borders.x && y > -1 && y < borders.y;
    }

    public float findCenterX(int destinationX) {
        return x + (float) (destinationX - x) / 2;
    }

    public float findCenterY(int destinationY) {
        return y + (float) (destinationY - y) / 2;
    }

    public int findDistanceToCell(Cell point) {
        return Math.abs(point.x - x) + Math.abs(point.y - y);
    }
}
