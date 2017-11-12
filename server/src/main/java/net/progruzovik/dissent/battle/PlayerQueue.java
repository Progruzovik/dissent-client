package net.progruzovik.dissent.battle;

import net.progruzovik.dissent.battle.captain.Player;

public interface PlayerQueue {

    boolean isQueued(Player player);

    void add(Player player);

    void remove(Player player);
}
