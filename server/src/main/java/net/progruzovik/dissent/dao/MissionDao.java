package net.progruzovik.dissent.dao;

import net.progruzovik.dissent.model.entity.Mission;

import java.util.List;

public interface MissionDao {

    Mission getMission(int id);

    List<Mission> getMissions();
}
