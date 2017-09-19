package net.progruzovik.dissent.battle;

import net.progruzovik.dissent.model.player.Player;

@FunctionalInterface
public interface FieldFactory {

    Field create(Player leftPlayer, Player rightPlayer);
}
