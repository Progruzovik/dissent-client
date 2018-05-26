package net.progruzovik.dissent.service;

import net.progruzovik.dissent.captain.Player;

public interface PlayerQueue {

    boolean isQueued(Player player);

    void add(Player player);

    void remove(Player player);
}
