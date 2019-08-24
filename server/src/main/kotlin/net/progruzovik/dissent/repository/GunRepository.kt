package net.progruzovik.dissent.repository

import net.progruzovik.dissent.model.entity.GunEntity
import org.springframework.data.repository.CrudRepository

interface GunRepository : CrudRepository<GunEntity, Int>
