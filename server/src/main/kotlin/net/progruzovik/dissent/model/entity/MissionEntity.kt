package net.progruzovik.dissent.model.entity

import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.GeneratedValue
import javax.persistence.Id

@Entity(name = "mission")
class MissionEntity {

    @Id
    @GeneratedValue
    var id = 0

    @Column(nullable = false)
    var name = ""
}
