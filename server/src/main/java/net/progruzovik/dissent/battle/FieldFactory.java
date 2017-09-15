package net.progruzovik.dissent.battle;

import net.progruzovik.dissent.dao.ShipDao;
import net.progruzovik.dissent.player.Player;

@FunctionalInterface
public interface FieldFactory {

    Field create(Player leftPlayer, Player rightPlayer, ShipDao shipDao);
}
