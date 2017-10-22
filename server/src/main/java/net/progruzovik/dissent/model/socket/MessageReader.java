package net.progruzovik.dissent.model.socket;

import net.progruzovik.dissent.model.player.Player;

import java.util.Map;

@FunctionalInterface
public interface MessageReader {

    void read(Player p, Map<String, Integer> d);
}
