import Unit from "./Unit";
import * as game from "../Game";

export default class Field extends game.Actor {

    static readonly CELL_WIDTH = 68;
    static readonly CELL_HEIGHT = 36;
    static readonly LINE_WIDTH = 2;

    private isMouseDown = false;
    private mouseX = 0;
    private mouseY = 0;

    private readonly lastCol: number;
    private readonly lastRow: number;

    private readonly units: Unit[] = [];

    private readonly content = new game.Actor();
    private readonly markForCurrent = new game.Rectangle(Field.CELL_WIDTH - Field.LINE_WIDTH,
        Field.CELL_HEIGHT - Field.LINE_WIDTH, 0x00FF00);
    private readonly markLayer = new PIXI.Container();

    constructor(colsCount: number, rowsCount: number, freeWidth: number, freeHeight: number) {
        super();
        this.interactive = true;
        this.lastCol = colsCount - 1;
        this.lastRow = rowsCount - 1;

        this.addChild(new game.Rectangle(freeWidth, freeHeight, 0x111111));
        for (let i = 0; i <= rowsCount; i++) {
            const line = new game.Rectangle(colsCount * Field.CELL_WIDTH + Field.LINE_WIDTH,
                Field.LINE_WIDTH, 0x777777);
            line.y = i * Field.CELL_HEIGHT;
            this.content.addChild(line);
        }
        for (let i = 0; i <= colsCount; i++) {
            const line = new game.Rectangle(Field.LINE_WIDTH,
                rowsCount * Field.CELL_HEIGHT + Field.LINE_WIDTH, 0x777777);
            line.x = i * Field.CELL_WIDTH;
            this.content.addChild(line);
        }
        this.markForCurrent.alpha = 0.4;
        this.markLayer.addChild(this.markForCurrent);
        this.content.addChild(this.markLayer);
        this.content.x = game.INDENT;
        this.content.y = game.INDENT;
        this.addChild(this.content);

        this.on(game.Event.MOUSE_DOWN, (e: PIXI.interaction.InteractionEvent) => {
            this.isMouseDown = true
            this.mouseX = e.data.global.x;
            this.mouseY = e.data.global.y;
        });
        this.on(game.Event.MOUSE_MOVE, (e: PIXI.interaction.InteractionEvent) => {
            if (this.isMouseDown) {
                this.content.x += e.data.global.x - this.mouseX;
                if (this.content.x > game.INDENT) {
                    this.content.x = game.INDENT;
                } else {
                    const leftBorder: number = freeWidth - this.content.width - game.INDENT;
                    if (this.content.x < leftBorder) {
                        this.content.x = leftBorder;
                    }
                }
                this.content.y += e.data.global.y - this.mouseY;
                if (this.content.y > game.INDENT) {
                    this.content.y = game.INDENT;
                } else {
                    const topBorder: number = freeHeight - this.content.height - game.INDENT;
                    if (this.content.y < topBorder) {
                        this.content.y = topBorder;
                    }
                }
                
                this.mouseX = e.data.global.x;
                this.mouseY = e.data.global.y;
            }
        });
        this.on(game.Event.MOUSE_UP, () => this.isMouseDown = false);
        this.on(game.Event.MOUSE_OUT, () => this.isMouseDown = false);
    }

    getLastCol() {
        return this.lastCol;
    }

    getLastRow() {
        return this.lastRow;
    }

    addUnit(unit: Unit) {
        this.units.push(unit);
        this.content.addChild(unit);
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
                this.markLayer.addChild(mark);
            }
        }
    }

    unmarkTargets() {
        this.markLayer.removeChildren(1);
    }
}
