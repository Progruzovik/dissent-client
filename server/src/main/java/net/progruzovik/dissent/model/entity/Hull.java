package net.progruzovik.dissent.model.entity;

import javax.persistence.*;

@Entity
public final class Hull {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private int actionPoints;

    @Column(nullable = false)
    private int strength;

    @Column(nullable = false)
    private int width;

    @Column(nullable = false)
    private int height;

    @ManyToOne
    @JoinColumn(name = "textureId", nullable = false)
    private Texture texture;

    public Hull(int id, String name, int actionPoints, int strength, int width, int height, Texture texture) {
        this.id = id;
        this.name = name;
        this.actionPoints = actionPoints;
        this.strength = strength;
        this.width = width;
        this.height = height;
        this.texture = texture;
    }

    public Hull() { }

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public int getActionPoints() {
        return actionPoints;
    }

    public int getStrength() {
        return strength;
    }

    public int getWidth() {
        return width;
    }

    public int getHeight() {
        return height;
    }

    public Texture getTexture() {
        return texture;
    }
}
