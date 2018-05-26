package net.progruzovik.dissent.battle.model;

import net.progruzovik.dissent.battle.model.field.Field;
import net.progruzovik.dissent.battle.exception.InvalidMoveException;
import net.progruzovik.dissent.battle.exception.InvalidUnitException;
import net.progruzovik.dissent.model.entity.*;
import net.progruzovik.dissent.battle.model.util.Cell;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.assertEquals;

public final class FieldTest {

    private final Ship ship;
    private Unit unit;
    private Field field;

    public FieldTest() {
        final Texture emptyTexture = new Texture(0, "texture");
        final Hull hull = new Hull(0, "test", 5, 2, 1, 1, emptyTexture);
        final GunType gunType = new GunType(0, "gunType");
        final Gun gun = new Gun(0, "gun", 3, 1, 1, gunType, emptyTexture);
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
