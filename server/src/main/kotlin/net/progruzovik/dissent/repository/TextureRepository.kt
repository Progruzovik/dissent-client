package net.progruzovik.dissent.repository

import net.progruzovik.dissent.model.entity.TextureEntity
import org.springframework.data.repository.CrudRepository

interface TextureRepository : CrudRepository<TextureEntity, Int>
