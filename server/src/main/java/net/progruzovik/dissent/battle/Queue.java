package net.progruzovik.dissent.battle;

import net.progruzovik.dissent.model.player.Player;

public interface Queue {

    boolean add(Player player);

    boolean remove(Player player);
}
