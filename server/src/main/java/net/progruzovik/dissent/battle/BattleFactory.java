package net.progruzovik.dissent.battle;

import net.progruzovik.dissent.battle.captain.Captain;
import net.progruzovik.dissent.battle.model.Battle;

@FunctionalInterface
public interface BattleFactory {

    Battle createBattle(Captain leftCaptain, Captain rightCaptain);
}
