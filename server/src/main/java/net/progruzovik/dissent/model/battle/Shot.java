package net.progruzovik.dissent.model.battle;

import net.progruzovik.dissent.model.util.Cell;

public final class Shot {

    private final int gunId;
    private final Cell cell;

    public Shot(int gunId, Cell cell) {
        this.gunId = gunId;
        this.cell = cell;
    }

    public int getGunId() {
        return gunId;
    }

    public Cell getCell() {
        return cell;
    }
}
