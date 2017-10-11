package net.progruzovik.dissent.model.entity;

import javax.persistence.*;

@Entity
public final class Hull {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private int speed;

    @ManyToOne
    @JoinColumn(name = "textureId", nullable = false)
    private Texture texture;

    public Hull() { }

    public int getId() {
        return id;
    }

    public int getSpeed() {
        return speed;
    }

    public Texture getTexture() {
        return texture;
    }
}
