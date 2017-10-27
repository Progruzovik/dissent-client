package net.progruzovik.dissent.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;

@Entity
public final class Gun {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private int shotCost;

    @Column(nullable = false)
    private int radius;

    @ManyToOne
    @JoinColumn(name = "gunTypeId", nullable = false)
    private GunType gunType;

    public Gun(int shotCost, int radius, GunType gunType) {
        this.shotCost = shotCost;
        this.radius = radius;
        this.gunType = gunType;
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
    public int getRadius() {
        return radius;
    }

    @JsonIgnore
    public GunType getGunType() {
        return gunType;
    }

    public String getGunTypeName() {
        return gunType.getName();
    }
}
