package net.progruzovik.dissent.dao;

import net.progruzovik.dissent.model.Ship;

import java.util.List;

public interface ShipDao {

    Ship getShip(int id);

    List<Ship> getShips();
}
