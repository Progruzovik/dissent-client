package net.progruzovik.dissent.dao;

import net.progruzovik.dissent.model.entity.Hull;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

@Repository
public final class HullJpa implements HullDao {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Hull getHull(int id) {
        return entityManager.find(Hull.class, id);
    }
}
