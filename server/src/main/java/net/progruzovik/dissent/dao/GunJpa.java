package net.progruzovik.dissent.dao;

import net.progruzovik.dissent.model.entity.Gun;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

@Repository
public final class GunJpa implements GunDao {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Gun getGun(int id) {
        return entityManager.find(Gun.class, id);
    }
}
