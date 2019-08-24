package net.progruzovik.dissent.repository

import net.progruzovik.dissent.model.entity.MissionEntity
import org.springframework.data.repository.CrudRepository

interface MissionRepository : CrudRepository<MissionEntity, Int>
