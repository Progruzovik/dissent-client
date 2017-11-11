package net.progruzovik.dissent.battle;

import net.progruzovik.dissent.battle.player.Captain;

public interface PlayerQueue {

    void add(Captain captain);

    void remove(Captain captain);
}
