package net.progruzovik.dissent.model.domain.battle;

import net.progruzovik.dissent.model.domain.battle.field.Field;
import net.progruzovik.dissent.exception.InvalidMoveException;
import net.progruzovik.dissent.exception.InvalidUnitException;
import net.progruzovik.dissent.model.domain.Ship;
import net.progruzovik.dissent.model.entity.*;
import net.progruzovik.dissent.model.domain.util.Cell;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.assertEquals;

public final class FieldTest {

    private final Ship ship;
    private Unit unit;
    private Field field;

    public FieldTest() {
        TextureEntity texture = new TextureEntity();
        texture.setName("texture");

        HullEntity hull = new HullEntity();
        hull.setName("test");
        hull.setActionPoints(5);
        hull.setStrength(2);
        hull.setWidth(1);
        hull.setHeight(1);
        hull.setTexture(texture);

        GunTypeEntity gunType = new GunTypeEntity();
        gunType.setName("gunType");

        GunEntity gun = new GunEntity();
        gun.setName("gun");
        gun.setShotCost(3);
        gun.setDamage(1);
        gun.setRadius(1);
        gun.setAccuracy(0.5);
        gun.setType(gunType);
        gun.setTexture(texture);

        ship = new Ship(hull, gun, null);
    }

    @Before
    public void setUp() {
        field = new Field(new Cell(50, 50));
        unit = new Unit(new Cell(0, 0), Side.LEFT, ship);
        unit.activate();
        field.addUnit(unit);
        field.setActiveUnit(unit);
    }

    @Test(expected = InvalidUnitException.class)
    public void setNotExistingActiveUnit() {
        field.setActiveUnit(new Unit(new Cell(0, 0), Side.NONE, ship));
    }

    @Test
    public void moveUnit() {
        assertEquals(5, unit.getActionPoints());
        final Cell cell = new Cell(unit.getFirstCell().getX() + 1, unit.getFirstCell().getY() + 2);
        field.moveActiveUnit(cell);
        assertEquals(2, unit.getActionPoints());
        assertEquals(cell, unit.getFirstCell());
    }

    @Test(expected = InvalidMoveException.class)
    public void moveUnitToUnreachableCell() {
        field.moveActiveUnit(new Cell(unit.getFirstCell().getX() + unit.getActionPoints(),
                unit.getFirstCell().getY() + unit.getActionPoints()));
    }
}
