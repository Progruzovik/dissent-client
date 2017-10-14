package net.progruzovik.dissent.model.battle;

import net.progruzovik.dissent.exception.InvalidMoveException;
import net.progruzovik.dissent.exception.InvalidUnitException;
import net.progruzovik.dissent.model.entity.*;
import net.progruzovik.dissent.model.util.Cell;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.assertEquals;

public final class FieldTest {

    private Field field;
    private Unit unit;
    private final Ship ship = new Ship(new Hull(0, 5, new Texture()),
            new Gun(3, 0, new GunType()), null);;

    @Before
    public void setUp() {
        field = new Field(new Cell(50, 50));
        unit = new Unit(Side.LEFT, new Cell(0, 0), ship);
        field.addUnit(unit);
        field.activateUnit(unit);
    }

    @Test(expected = InvalidUnitException.class)
    public void activateNotExistingUnit() {
        field.activateUnit(new Unit(Side.NONE, new Cell(0, 0), ship));
    }

    @Test
    public void moveUnit() {
        assertEquals(5, unit.getMovementPoints());
        field.moveActiveUnit(new Cell(unit.getCell().getX() + 1, unit.getCell().getY() + 2));
        assertEquals(2, unit.getMovementPoints());
    }

    @Test(expected = InvalidMoveException.class)
    public void moveUnitToUnreachableCell() {
        field.moveActiveUnit(new Cell(unit.getCell().getX() + unit.getMovementPoints(),
                unit.getCell().getY() + unit.getMovementPoints()));
    }
}
