package net.progruzovik.dissent.model.entity

import javax.persistence.*

@Entity
@Table(name = "mission")
data class MissionEntity(

    @Id
    @GeneratedValue
    @Column(name = "id", nullable = false)
    val id: Int,

    @Column(name = "name", nullable = false)
    val name: String
)
