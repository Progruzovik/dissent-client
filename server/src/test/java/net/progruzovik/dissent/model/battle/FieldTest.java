package net.progruzovik.dissent.model.battle;

import net.progruzovik.dissent.exception.InvalidMoveException;
import net.progruzovik.dissent.exception.InvalidUnitException;
import net.progruzovik.dissent.model.battle.field.Field;
import net.progruzovik.dissent.model.entity.*;
import net.progruzovik.dissent.model.util.Cell;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.assertEquals;

public final class FieldTest {

    private Field field;
    private Unit unit;
    private final Ship ship = new Ship(new Hull(0, 5, 2, new Texture()),
            new Gun(0, 3, new GunType()), null);

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
        final Cell cell = new Cell(unit.getCell().getX() + 1, unit.getCell().getY() + 2);
        field.moveActiveUnit(cell);
        assertEquals(2, unit.getActionPoints());
        assertEquals(cell, unit.getCell());
    }

    @Test(expected = InvalidMoveException.class)
    public void moveUnitToUnreachableCell() {
        field.moveActiveUnit(new Cell(unit.getCell().getX() + unit.getActionPoints(),
                unit.getCell().getY() + unit.getActionPoints()));
    }
}
