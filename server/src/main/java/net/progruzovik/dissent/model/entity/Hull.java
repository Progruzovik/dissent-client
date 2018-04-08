package net.progruzovik.dissent.model.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.lang.NonNull;

import javax.persistence.*;

@Entity
public final class Hull {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private @NonNull String name;

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
    private @NonNull Texture texture;

    public Hull(@JsonProperty("id") int id,
                @JsonProperty("name") @NonNull String name,
                @JsonProperty("actionPoints") int actionPoints,
                @JsonProperty("strength") int strength,
                @JsonProperty("width") int width,
                @JsonProperty("height") int height,
                @JsonProperty("texture") @NonNull Texture texture) {
        this.id = id;
        this.name = name;
        this.actionPoints = actionPoints;
        this.strength = strength;
        this.width = width;
        this.height = height;
        this.texture = texture;
    }

    public int getId() {
        return id;
    }

    @NonNull
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

    @NonNull
    public Texture getTexture() {
        return texture;
    }
}
