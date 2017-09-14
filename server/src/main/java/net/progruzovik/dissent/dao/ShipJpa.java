package net.progruzovik.dissent.dao;

import net.progruzovik.dissent.model.Ship;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

@Repository
public final class ShipJpa implements ShipDao {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Ship getShip(int id) {
        return entityManager.find(Ship.class, id);
    }
}
