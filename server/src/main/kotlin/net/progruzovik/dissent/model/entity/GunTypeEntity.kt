package net.progruzovik.dissent.model.entity

import javax.persistence.*

@Entity
@Table(name = "gun_type")
class GunTypeEntity(

    @Id
    @GeneratedValue
    val id: Int,

    @Column(nullable = false)
    val name: String
)
