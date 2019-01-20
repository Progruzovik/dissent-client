package net.progruzovik.dissent.repository

import net.progruzovik.dissent.model.entity.Hull
import org.springframework.data.repository.CrudRepository

interface HullRepository : CrudRepository<Hull, Int>
