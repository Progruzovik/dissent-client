package net.progruzovik.dissent.model.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.lang.NonNull;

import javax.persistence.*;

@Entity
public final class Gun {

    public static final int NO_GUN_ID = -1;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private @NonNull String name;

    @Column(nullable = false)
    private int shotCost;

    @Column(nullable = false)
    private int damage;

    @Column(nullable = false)
    private int radius;

    @ManyToOne
    @JoinColumn(name = "gunTypeId", nullable = false)
    private @NonNull GunType type;

    @ManyToOne
    @JoinColumn(name = "textureId", nullable = false)
    private @NonNull Texture texture;

    public Gun(@JsonProperty("id") int id,
               @JsonProperty("name") @NonNull String name,
               @JsonProperty("shotCost") int shotCost,
               @JsonProperty("damage") int damage,
               @JsonProperty("radius") int radius,
               @JsonProperty("type") @NonNull GunType type,
               @JsonProperty("texture") @NonNull Texture texture) {
        this.id = id;
        this.name = name;
        this.shotCost = shotCost;
        this.damage = damage;
        this.radius = radius;
        this.type = type;
        this.texture = texture;
    }

    public int getId() {
        return id;
    }

    @NonNull
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

    @NonNull
    public String getTypeName() {
        return type.getName();
    }

    @NonNull
    public Texture getTexture() {
        return texture;
    }
}
