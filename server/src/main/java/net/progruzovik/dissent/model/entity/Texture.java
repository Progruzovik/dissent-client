package net.progruzovik.dissent.model.entity;

import org.springframework.lang.NonNull;

import javax.persistence.*;

@Entity
public final class Texture {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private String name;

    public Texture(int id, @NonNull String name) {
        this.id = id;
        this.name = name;
    }

    Texture() { }

    public int getId() {
        return id;
    }

    @NonNull
    public String getName() {
        return name;
    }
}
