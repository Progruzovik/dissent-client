package net.progruzovik.dissent.model.entity

import javax.persistence.*

@Entity
@Table(name = "gun")
data class GunEntity(

    @Id
    @GeneratedValue
    @Column(name = "id", nullable = false)
    val id: Int,

    @Column(name = "name", nullable = false)
    val name: String,

    @Column(name = "shot_cost", nullable = false)
    val shotCost: Int,

    @Column(name = "damage", nullable = false)
    val damage: Int,

    @Column(name = "radius", nullable = false)
    val radius: Int,

    @Column(name = "accuracy", nullable = false)
    val accuracy: Double,

    @ManyToOne
    @JoinColumn(name = "gun_type_id", nullable = false)
    val type: GunTypeEntity,

    @ManyToOne
    @JoinColumn(name = "texture_id", nullable = false)
    val texture: TextureEntity
) {

    //TODO: add domain layer
    val typeName: String
        get() = type.name

    companion object {
        const val NO_GUN_ID = -1
    }
}
