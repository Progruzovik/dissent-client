package net.progruzovik.dissent.model.entity

import javax.persistence.*

@Entity
@Table(name = "gun")
class GunEntity(

    @Id
    @GeneratedValue
    val id: Int,

    @Column(nullable = false)
    val name: String,

    @Column(nullable = false)
    val shotCost: Int,

    @Column(nullable = false)
    val damage: Int,

    @Column(nullable = false)
    val radius: Int,

    @Column(nullable = false)
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
