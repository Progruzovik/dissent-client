package net.progruzovik.dissent.model.entity;

import javax.persistence.*;

@Entity
public final class Hull {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private int actionPoints;

    @ManyToOne
    @JoinColumn(name = "textureId", nullable = false)
    private Texture texture;

    public Hull() { }

    public Hull(int id, int actionPoints, Texture texture) {
        this.id = id;
        this.actionPoints = actionPoints;
        this.texture = texture;
    }

    public int getId() {
        return id;
    }

    public int getActionPoints() {
        return actionPoints;
    }

    public Texture getTexture() {
        return texture;
    }
}
