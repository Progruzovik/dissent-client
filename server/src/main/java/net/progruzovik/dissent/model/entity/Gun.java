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

    @Column(nullable = false)
    private String projectileType;

    @Column(nullable = false)
    private int shotsCount;

    @Column(nullable = false)
    private int shotDelay;

    public Gun() { }

    public Gun(int id, String name, int radius, int cooldown, String projectileType, int shotsCount, int shotDelay) {
        this.id = id;
        this.name = name;
        this.radius = radius;
        this.cooldown = cooldown;
        this.projectileType = projectileType;
        this.shotsCount = shotsCount;
        this.shotDelay = shotDelay;
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

    public String getProjectileType() {
        return projectileType;
    }

    public int getShotsCount() {
        return shotsCount;
    }

    public int getShotDelay() {
        return shotDelay;
    }
}
