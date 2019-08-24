package net.progruzovik.dissent.model.entity

import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.GeneratedValue
import javax.persistence.Id

@Entity(name = "gun_type")
class GunTypeEntity {

    @Id
    @GeneratedValue
    var id = 0

    @Column(nullable = false)
    var name = ""
}
