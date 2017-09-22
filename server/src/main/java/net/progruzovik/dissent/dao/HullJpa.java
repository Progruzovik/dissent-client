package net.progruzovik.dissent.dao;

import net.progruzovik.dissent.model.Hull;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.criteria.CriteriaQuery;
import java.util.List;

@Repository
public final class HullJpa implements HullDao {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Hull getHull(int id) {
        return entityManager.find(Hull.class, id);
    }
}
