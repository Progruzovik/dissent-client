package net.progruzovik.dissent.battle;

import net.progruzovik.dissent.model.Unit;
import net.progruzovik.dissent.player.Player;

import java.util.LinkedList;
import java.util.Queue;

public final class FieldService implements Field {

    private static final int UNIT_INDENT = 3;
    private static final int BORDER_INDENT = 4;

    private final int colsCount;
    private final int rowsCount;

    private final Player leftPlayer;
    private final Player rightPlayer;

    private final Queue<Unit> queue = new LinkedList<>();

    public FieldService(Player leftPlayer, Player rightPlayer) {
        final int unitsCount = Math.max(leftPlayer.getUnits().size(), rightPlayer.getUnits().size());
        colsCount = unitsCount * UNIT_INDENT + BORDER_INDENT * 2;
        rowsCount = colsCount;

        int i = 0;
        for (final Unit unit : leftPlayer.getUnits()) {
            unit.setSide(Side.Left);
            unit.setCol(0);
            unit.setRow(i * UNIT_INDENT + BORDER_INDENT);
            queue.add(unit);
            i++;
        }
        this.leftPlayer = leftPlayer;
        i = 0;
        for (final Unit unit : rightPlayer.getUnits()) {
            unit.setSide(Side.Right);
            unit.setCol(colsCount - 1);
            unit.setRow(i * UNIT_INDENT + BORDER_INDENT);
            queue.add(unit);
            i++;
        }
        this.rightPlayer = rightPlayer;
    }

    @Override
    public int getColsCount() {
        return colsCount;
    }

    @Override
    public int getRowsCount() {
        return rowsCount;
    }

    @Override
    public Unit getCurrentUnit() {
        return queue.element();
    }

    @Override
    public Queue<Unit> getQueue() {
        return queue;
    }

    @Override
    public Side getPlayerSide(Player player) {
        if (player == leftPlayer) {
            return Side.Left;
        }
        if (player == rightPlayer) {
            return Side.Right;
        }
        return Side.None;
    }

    @Override
    public boolean moveCurrentUnit(Player player, int col, int row) {
        if (getPlayerSide(player) == getCurrentUnit().getSide()
                && col > -1 && col < colsCount && row > -1 && row < rowsCount) {
            getCurrentUnit().setCol(col);
            getCurrentUnit().setRow(row);
            nextTurn();
            return true;
        }
        return false;
    }

    private void nextTurn() {
        queue.add(queue.remove());
    }
}
