package net.progruzovik.dissent.dao;

import net.progruzovik.dissent.model.entity.Texture;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.criteria.CriteriaQuery;
import java.util.List;

@Repository
public final class TextureJpa implements TextureDao {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<Texture> getTextures() {
        final CriteriaQuery<Texture> query = entityManager.getCriteriaBuilder().createQuery(Texture.class);
        query.from(Texture.class);
        return entityManager.createQuery(query).getResultList();
    }
}
