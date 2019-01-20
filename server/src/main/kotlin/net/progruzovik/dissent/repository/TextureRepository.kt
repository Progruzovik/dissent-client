package net.progruzovik.dissent.repository

import net.progruzovik.dissent.model.entity.Texture
import org.springframework.data.repository.CrudRepository

interface TextureRepository : CrudRepository<Texture, Int>
