package net.progruzovik.dissent.dao;

import net.progruzovik.dissent.model.entity.Mission;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.criteria.CriteriaQuery;
import java.util.List;

@Repository
public final class MissionJpa implements MissionDao {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Mission getMission(int id) {
        return entityManager.find(Mission.class, id);
    }

    @Override
    public List<Mission> getMissions() {
        final CriteriaQuery<Mission> query = entityManager.getCriteriaBuilder().createQuery(Mission.class);
        query.from(Mission.class);
        return entityManager.createQuery(query).getResultList();
    }
}
