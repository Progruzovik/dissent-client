package net.progruzovik.dissent.model.entity

import javax.persistence.*

@Entity
@Table(name = "texture")
class TextureEntity(

    @Id
    @GeneratedValue
    val id: Int,

    @Column(nullable = false)
    val name: String
)
