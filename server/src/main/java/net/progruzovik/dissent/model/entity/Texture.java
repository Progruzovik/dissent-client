package net.progruzovik.dissent.model.entity;

import javax.persistence.*;

@Entity
public final class Texture {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private String name;

    public Texture() { }

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }
}
