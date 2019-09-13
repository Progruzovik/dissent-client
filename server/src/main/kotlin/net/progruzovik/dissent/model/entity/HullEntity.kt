package net.progruzovik.dissent.model.entity

import javax.persistence.*

@Entity
@Table(name = "hull")
data class HullEntity(

    @Id
    @GeneratedValue
    @Column(name = "id", nullable = false)
    val id: Int,

    @Column(name = "name", nullable = false)
    val name: String,

    @Column(name = "action_points", nullable = false)
    val actionPoints: Int,

    @Column(name = "strength", nullable = false)
    val strength: Int,

    @Column(name = "width", nullable = false)
    val width: Int,

    @Column(name = "height", nullable = false)
    val height: Int,

    @ManyToOne
    @JoinColumn(name = "texture_id", nullable = false)
    val texture: TextureEntity
)
