package net.progruzovik.dissent.repository

import net.progruzovik.dissent.model.entity.Gun
import org.springframework.data.repository.CrudRepository

interface GunRepository : CrudRepository<Gun, Int>
