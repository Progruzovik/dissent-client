package net.progruzovik.dissent.model.socket;

import net.progruzovik.dissent.model.player.Player;

@FunctionalInterface
public interface MessageReader {

    void read(Player p, ClientMessage m);
}
