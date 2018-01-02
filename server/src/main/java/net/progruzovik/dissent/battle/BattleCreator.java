package net.progruzovik.dissent.battle;

import net.progruzovik.dissent.battle.captain.Captain;

public interface BattleCreator {

    void createBattle(Captain leftCaptain, Captain rightCaptain);
}
