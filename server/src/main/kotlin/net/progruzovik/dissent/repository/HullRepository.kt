package net.progruzovik.dissent.repository

import net.progruzovik.dissent.model.entity.HullEntity
import org.springframework.data.repository.CrudRepository

interface HullRepository : CrudRepository<HullEntity, Int>
