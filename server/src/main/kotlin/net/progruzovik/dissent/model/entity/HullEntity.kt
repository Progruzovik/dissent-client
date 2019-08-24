package net.progruzovik.dissent.model.entity

import javax.persistence.*

@Entity(name = "hull")
class HullEntity {

    @Id
    @GeneratedValue
    var id = 0

    @Column(nullable = false)
    var name = ""

    @Column(nullable = false)
    var actionPoints = 0

    @Column(nullable = false)
    var strength = 0

    @Column(nullable = false)
    var width = 0

    @Column(nullable = false)
    var height = 0

    @ManyToOne
    @JoinColumn(name = "texture_id", nullable = false)
    lateinit var texture: TextureEntity
}
