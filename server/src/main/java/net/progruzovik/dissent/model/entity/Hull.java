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

    @ManyToOne
    @JoinColumn(name = "textureId", nullable = false)
    private Texture texture;

    public Hull(int id, String name, int actionPoints, int strength, Texture texture) {
        this.id = id;
        this.name = name;
        this.actionPoints = actionPoints;
        this.strength = strength;
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

    public Texture getTexture() {
        return texture;
    }
}
