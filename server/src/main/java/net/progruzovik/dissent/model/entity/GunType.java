package net.progruzovik.dissent.model.entity;

import javax.persistence.*;

@Entity
public final class GunType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private String name;

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }
}
