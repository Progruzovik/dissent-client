package net.progruzovik.dissent.model.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.lang.NonNull;

import javax.persistence.*;

@Entity
public final class GunType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private @NonNull String name;

    public GunType(@JsonProperty("id") int id,
                   @JsonProperty("name") @NonNull String name) {
        this.id = id;
        this.name = name;
    }

    public int getId() {
        return id;
    }

    @NonNull
    public String getName() {
        return name;
    }
}
