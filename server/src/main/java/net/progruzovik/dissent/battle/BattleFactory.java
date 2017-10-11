package net.progruzovik.dissent.battle;

import net.progruzovik.dissent.model.player.Player;

@FunctionalInterface
public interface BattleFactory {

    Battle create(Player leftPlayer, Player rightPlayer);
}
