package net.progruzovik.dissent.battle;

import net.progruzovik.dissent.model.player.Captain;

@FunctionalInterface
public interface BattleFactory {

    Battle create(Captain leftCaptain, Captain rightCaptain);
}
