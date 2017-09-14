package net.progruzovik.dissent.model;

import javax.persistence.*;

@Entity
public final class Ship {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private int speed;

    public Ship(String name, int speed) {
        this.name = name;
        this.speed = speed;
    }

    public Ship() {}

    public String getName() {
        return name;
    }

    public int getSpeed() {
        return speed;
    }
}
