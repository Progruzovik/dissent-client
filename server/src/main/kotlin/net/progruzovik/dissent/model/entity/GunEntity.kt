package net.progruzovik.dissent.model.entity

import javax.persistence.*

@Entity(name = "gun")
class GunEntity {

    @Id
    @GeneratedValue
    var id = 0

    @Column(nullable = false)
    var name = ""

    @Column(nullable = false)
    var shotCost = 0

    @Column(nullable = false)
    var damage = 0

    @Column(nullable = false)
    var radius = 0

    @Column(nullable = false)
    var accuracy = 0.0

    @ManyToOne
    @JoinColumn(name = "gun_type_id", nullable = false)
    lateinit var type: GunTypeEntity

    @ManyToOne
    @JoinColumn(name = "texture_id", nullable = false)
    lateinit var texture: TextureEntity

    //TODO: add domain layer
    val typeName: String get() = type.name

    companion object {
        const val NO_GUN_ID = -1
    }
}
