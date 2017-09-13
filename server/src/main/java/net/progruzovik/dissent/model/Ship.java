package net.progruzovik.dissent.model;

public final class Ship {

    private final int speed;
    private final String name;

    public Ship(int speed, String name) {
        this.speed = speed;
        this.name = name;
    }

    public int getSpeed() {
        return speed;
    }

    public String getName() {
        return name;
    }
}
