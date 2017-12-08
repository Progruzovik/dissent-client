package net.progruzovik.dissent.model.socket;

import net.progruzovik.dissent.battle.captain.Player;

import java.util.Map;

@FunctionalInterface
public interface MessageReader {

    void read(Player player, Map<String, Integer> data);
}
