package net.progruzovik.dissent.dao;

import net.progruzovik.dissent.model.Ship;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.criteria.CriteriaQuery;
import java.util.List;

@Repository
public final class ShipJpa implements ShipDao {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Ship getShip(int id) {
        return entityManager.find(Ship.class, id);
    }

    @Override
    public List<Ship> getShips() {
        CriteriaQuery<Ship> query = entityManager.getCriteriaBuilder().createQuery(Ship.class);
        query.from(Ship.class);
        return entityManager.createQuery(query).getResultList();
    }
}
