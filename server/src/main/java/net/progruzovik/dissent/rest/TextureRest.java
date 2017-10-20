package net.progruzovik.dissent.rest;

import net.progruzovik.dissent.dao.TextureDao;
import net.progruzovik.dissent.model.entity.Texture;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collection;

@RestController
@RequestMapping("/api/textures")
public final class TextureRest {

    private final TextureDao textureDao;

    public TextureRest(TextureDao textureDao) {
        this.textureDao = textureDao;
    }

    @GetMapping
    public Collection<Texture> getTextures() {
        return textureDao.getTextures();
    }
}
