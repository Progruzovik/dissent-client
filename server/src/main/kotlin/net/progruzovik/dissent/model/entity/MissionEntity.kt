package net.progruzovik.dissent.model.entity

import javax.persistence.*

@Entity
@Table(name = "mission")
class MissionEntity(

    @Id
    @GeneratedValue
    val id: Int,

    @Column(nullable = false)
    val name: String
)
