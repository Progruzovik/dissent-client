package net.progruzovik.dissent.battle.model;

import net.progruzovik.dissent.model.util.Cell;

public final class Shot {

    private final int gunId;
    private final int damage;

    private final Cell cell;

    public Shot(int gunId, int damage, Cell cell) {
        this.gunId = gunId;
        this.damage = damage;
        this.cell = cell;
    }

    public int getGunId() {
        return gunId;
    }

    public int getDamage() {
        return damage;
    }

    public Cell getCell() {
        return cell;
    }
}
