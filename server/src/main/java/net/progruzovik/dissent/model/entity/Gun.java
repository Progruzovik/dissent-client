package net.progruzovik.dissent.model.entity;

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

    @ManyToOne
    @JoinColumn(name = "textureId", nullable = false)
    private Texture texture;

    public Gun(int shotCost, int radius, GunType type, Texture texture) {
        this.shotCost = shotCost;
        this.radius = radius;
        this.type = type;
        this.texture = texture;
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

    public int getDamage() {
        return damage;
    }

    public int getRadius() {
        return radius;
    }

    public String getTypeName() {
        return type.getName();
    }

    public Texture getTexture() {
        return texture;
    }
}
