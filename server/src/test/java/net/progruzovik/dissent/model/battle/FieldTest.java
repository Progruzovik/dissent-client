package net.progruzovik.dissent.model.battle;

import net.progruzovik.dissent.exception.InvalidMoveException;
import net.progruzovik.dissent.exception.InvalidUnitException;
import net.progruzovik.dissent.model.entity.Gun;
import net.progruzovik.dissent.model.entity.Hull;
import net.progruzovik.dissent.model.entity.Ship;
import net.progruzovik.dissent.model.entity.Texture;
import net.progruzovik.dissent.model.util.Cell;
import org.junit.Before;
import org.junit.Test;

public final class FieldTest {

    private Field field;
    private Unit unit;
    private final Ship ship = new Ship(new Hull(0, 3, new Texture(0, "texture")),
            new Gun(0, "gun", 3, 0, "shell", 1, 0),
            null);

    @Before
    public void setUp() {
        field = new Field(new Cell(50, 50));
        unit = new Unit(Side.LEFT, new Cell(0, 0), ship);
        field.addUnit(unit);
        field.activateUnit(unit);
    }

    @Test(expected = InvalidUnitException.class)
    public void createPathsForNotExistingUnit() {
        field.activateUnit(new Unit(Side.NONE, new Cell(0, 0), ship));
    }

    @Test
    public void moveUnit() {
        field.moveActiveUnit(new Cell(unit.getCell().getX() + 1, unit.getCell().getY() + 1));
    }

    @Test(expected = InvalidMoveException.class)
    public void moveUnitToUnreachableCell() {
        field.moveActiveUnit(new Cell(unit.getCell().getX() + unit.getMovementPoints(),
                unit.getCell().getY() + unit.getMovementPoints()));
    }
}
