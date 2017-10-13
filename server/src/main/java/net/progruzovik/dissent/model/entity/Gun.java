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
    private int radius;

    @Column(nullable = false)
    private int cooldown;

    @Column
    private int shotsCount;

    @Column
    private int shotDelay;

    @ManyToOne
    @JoinColumn(name = "gunTypeId", nullable = false)
    private GunType gunType;

    public Gun() { }

    public Gun(int radius, int cooldown, GunType gunType) {
        this.radius = radius;
        this.cooldown = cooldown;
        this.gunType = gunType;
    }

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    @JsonIgnore
    public int getRadius() {
        return radius;
    }

    public int getCooldown() {
        return cooldown;
    }

    public int getShotsCount() {
        return shotsCount;
    }

    public int getShotDelay() {
        return shotDelay;
    }

    @JsonIgnore
    public GunType getGunType() {
        return gunType;
    }

    public String getGunTypeName() {
        return gunType.getName();
    }
}
