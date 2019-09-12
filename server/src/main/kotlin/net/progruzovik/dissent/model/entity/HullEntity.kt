package net.progruzovik.dissent.model.entity

import javax.persistence.*

@Entity
@Table(name = "hull")
class HullEntity(

    @Id
    @GeneratedValue
    val id: Int,

    @Column(nullable = false)
    val name: String,

    @Column(nullable = false)
    val actionPoints: Int,

    @Column(nullable = false)
    val strength: Int,

    @Column(nullable = false)
    val width: Int,

    @Column(nullable = false)
    val height: Int,

    @ManyToOne
    @JoinColumn(name = "texture_id", nullable = false)
    val texture: TextureEntity
)
