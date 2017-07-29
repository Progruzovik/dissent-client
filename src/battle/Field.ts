import Unit from "./Unit";
import * as game from "../Game";

export default class Field extends game.Actor {

    static readonly CELL_WIDTH = 68;
    static readonly CELL_HEIGHT = 36;
    static readonly LINE_WIDTH = 2;

    readonly lastCol: number;
    readonly lastRow: number;

    private readonly units: Unit[] = [];
    private readonly markForCurrent = new game.Rectangle(Field.CELL_WIDTH - Field.LINE_WIDTH,
        Field.CELL_HEIGHT - Field.LINE_WIDTH, 0x00FF00);
    private readonly marks = new PIXI.Container();

    constructor(colsCount: number, rowsCount: number) {
        super();
        this.lastCol = colsCount - 1;
        this.lastRow = rowsCount - 1;
        for (let i = 0; i <= rowsCount; i++) {
            const line = new game.Rectangle(colsCount * Field.CELL_WIDTH + Field.LINE_WIDTH,
                Field.LINE_WIDTH, 0x777777);
            line.y = i * Field.CELL_HEIGHT;
            this.addChild(line);
        }
        for (let i = 0; i <= colsCount; i++) {
            const line = new game.Rectangle(Field.LINE_WIDTH,
                rowsCount * Field.CELL_HEIGHT + Field.LINE_WIDTH, 0x777777);
            line.x = i * Field.CELL_WIDTH;
            this.addChild(line);
        }
        this.markForCurrent.alpha = 0.4;
        this.marks.addChild(this.markForCurrent);
        this.addChild(this.marks);
    }

    addUnit(unit: Unit) {
        this.units.push(unit);
        this.addChild(unit);
    }

    removeUnit(unit: Unit) {
        this.units.splice(this.units.indexOf(unit), 1);
    }

    hasUnitsOnBothSides(): boolean {
        let hasUnitOnLeft = false, hasUnitOnRight = false;
        for (const unit of this.units) {
            if (unit.isLeft) {
                hasUnitOnLeft = true;
            } else {
                hasUnitOnRight = true;
            }
        }
        return hasUnitOnLeft && hasUnitOnRight;
    }

    hasUnitOnCell(col: number, row: number): boolean {
        for (const unit of this.units) {
            if (unit.getCol() == col && unit.getRow() == row) {
                return true;
            }
        }
        return false;
    }

    nextTurn(currentUnit: Unit): Unit {
        if (currentUnit) {
            this.units.push(currentUnit);
        }
        const nextUnit: Unit = this.units.shift();
        this.markForCurrent.x = nextUnit.x;
        this.markForCurrent.y = nextUnit.y;
        return nextUnit;
    }

    markTargets(isLeft: boolean) {
        for (const unit of this.units) {
            if (unit.isLeft == isLeft) {
                const mark = new game.Rectangle(this.markForCurrent.width, this.markForCurrent.height, 0xFF0000);
                mark.alpha = this.markForCurrent.alpha;
                mark.x = unit.x;
                mark.y = unit.y;
                this.marks.addChild(mark);
            }
        }
    }

    unmarkTargets() {
        this.marks.removeChildren(1);
    }
}
