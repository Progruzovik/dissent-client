package net.progruzovik.dissent.battle;

import net.progruzovik.dissent.model.Unit;
import net.progruzovik.dissent.player.Player;

import java.util.Queue;

public interface Field {

    int getColsCount();

    int getRowsCount();

    int getTurnNumber();

    Unit getCurrentUnit();

    Queue<Unit> getQueue();

    Side getPlayerSide(Player player);

    boolean moveCurrentUnit(Player player, int col, int row);

    boolean nextTurn(Player player);
}
