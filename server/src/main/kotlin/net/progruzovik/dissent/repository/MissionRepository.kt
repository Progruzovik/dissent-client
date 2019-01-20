package net.progruzovik.dissent.repository

import net.progruzovik.dissent.model.entity.Mission
import org.springframework.data.repository.CrudRepository

interface MissionRepository : CrudRepository<Mission, Int>
