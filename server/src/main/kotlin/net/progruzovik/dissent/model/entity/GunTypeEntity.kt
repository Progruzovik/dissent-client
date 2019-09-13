package net.progruzovik.dissent.model.entity

import javax.persistence.*

@Entity
@Table(name = "gun_type")
data class GunTypeEntity(

    @Id
    @GeneratedValue
    @Column(name = "id", nullable = false)
    val id: Int,

    @Column(name = "name", nullable = false)
    val name: String
)
