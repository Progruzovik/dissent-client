package net.progruzovik.dissent.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;

@Entity
public final class Gun {

    public static final int NO_GUN_ID = -1;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private int shotCost;

    @Column(nullable = false)
    private int damage;

    @Column(nullable = false)
    private int radius;

    @ManyToOne
    @JoinColumn(name = "gunTypeId", nullable = false)
    private GunType type;

    public Gun(int shotCost, int radius, GunType type) {
        this.shotCost = shotCost;
        this.radius = radius;
        this.type = type;
    }

    public Gun() { }

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public int getShotCost() {
        return shotCost;
    }

    @JsonIgnore
    public int getDamage() {
        return damage;
    }

    @JsonIgnore
    public int getRadius() {
        return radius;
    }

    public String getTypeName() {
        return type.getName();
    }
}
