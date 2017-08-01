import Unit from "./Unit";
import UnitManager from "./UnitManager";
import * as game from "../game";

export default class Field extends game.Actor {

    static readonly LINE_WIDTH = 2;

    private isMouseDown = false;
    private mouseX: number;
    private mouseY: number;

    private readonly content = new game.Actor();
    private readonly markLayer: MarkLayer;

    constructor(colsCount: number, rowsCount: number, freeWidth: number, freeHeight: number,
        unitManager: UnitManager) {
        super();
        this.interactive = true;
        this.markLayer = new MarkLayer(colsCount, rowsCount, unitManager);

        this.addChild(new game.Rectangle(freeWidth, freeHeight, 0x111111));
        for (let i = 0; i <= rowsCount; i++) {
            const line = new game.Rectangle(colsCount * Unit.WIDTH + Field.LINE_WIDTH, Field.LINE_WIDTH, 0x777777);
            line.y = i * Unit.HEIGHT;
            this.content.addChild(line);
        }
        for (let i = 0; i <= colsCount; i++) {
            const line = new game.Rectangle(Field.LINE_WIDTH, rowsCount * Unit.HEIGHT + Field.LINE_WIDTH, 0x777777);
            line.x = i * Unit.WIDTH;
            this.content.addChild(line);
        }
        this.content.addChild(this.markLayer);
        for (const unit of unitManager.units) {
            this.content.addChild(unit);

            unit.on(Unit.PREPARED_TO_SHOT, () => {
                this.markLayer.removeAllMarksExceptCurrent();
                for (const target of unitManager.units) {
                    if (unit.isLeft != target.isLeft) {
                        const mark = new Mark(0xFF0000);
                        mark.setCell(target.col, target.row);
                        this.markLayer.addChild(mark);
                    }
                }
            });
            unit.on(Unit.NOT_PREPARED_TO_SHOT, () => {
                this.markLayer.removeAllMarksExceptCurrent();
                this.markLayer.addPathMarks();
            });
        }
        this.addChild(this.content);

        this.markLayer.on(game.Event.MOUSE_UP, () => this.isMouseDown = false);
        this.on(game.Event.MOUSE_DOWN, (e: PIXI.interaction.InteractionEvent) => {
            this.isMouseDown = true
            this.mouseX = e.data.global.x;
            this.mouseY = e.data.global.y;
        });
        this.on(game.Event.MOUSE_MOVE, (e: PIXI.interaction.InteractionEvent) => {
            if (this.isMouseDown) {
                this.content.x += e.data.global.x - this.mouseX;
                if (this.content.x > 0) {
                    this.content.x = 0;
                } else {
                    const leftBorder: number = freeWidth - this.content.width;
                    if (leftBorder > 0) {
                        this.content.x = 0;
                    } else if (this.content.x < leftBorder) {
                        this.content.x = leftBorder;
                    }
                }
                this.content.y += e.data.global.y - this.mouseY;
                if (this.content.y > 0) {
                    this.content.y = 0;
                } else {
                    const topBorder: number = freeHeight - this.content.height;
                    if (topBorder > 0) {
                        this.content.y = 0;
                    } else if (this.content.y < topBorder) {
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
}

class MarkLayer extends PIXI.Container {

    private readonly currentMark = new Mark(0x00FF00);
    private readonly pathMarks: Mark[] = [];

    constructor(private readonly colsCount: number, private readonly rowsCount: number,
        private readonly unitManager: UnitManager) {
        super();
        this.addChild(this.currentMark);
        this.createPathMarks(unitManager.currentUnit);
        unitManager.on(UnitManager.NEXT_TURN, (currentUnit: Unit) => this.createPathMarks(currentUnit));
    }

    addPathMarks() {
        for (const mark of this.pathMarks) {
            this.addChild(mark);
        }
    }

    removeAllMarksExceptCurrent() {
        this.removeChildren();
        this.addChild(this.currentMark);
    }

    private createPathMarks(unit: Unit) {
        this.removeAllMarksExceptCurrent();
        this.currentMark.setCell(unit.col, unit.row);
        const reachableUnits: Unit[] = this.unitManager.findReachableUnitsForCurrent();
        
        const pathPoint = new game.Rectangle(15, 15, 0x00FF00);
        pathPoint.x = (Unit.WIDTH - pathPoint.width) / 2;
        pathPoint.y = (Unit.HEIGHT - pathPoint.height) / 2;
        
        this.pathMarks.length = 0;
        for (let i = 0; i < unit.speed; i++) {
            for (let j = 1; j <= unit.speed - i; j++) {
                for (let k = 0; k < 4; k++) {
                    let markCol: number = unit.col, markRow: number = unit.row;
                    if (k == 0) {
                        markCol += j;
                        markRow += i;
                    } else if (k == 1) {
                        markCol -= i;
                        markRow += j;
                    } else if (k == 2) {
                        markCol -= j;
                        markRow -= i;
                    } else if (k == 3) {
                        markCol += i;
                        markRow -= j;
                    }

                    if (markCol > -1 && markCol < this.colsCount && markRow > -1 && markRow < this.rowsCount
                        && !reachableUnits.some((unit: Unit) => unit.col == markCol && unit.row == markRow)) {
                        const pathMark = new Mark(0xFFFF00);
                        pathMark.setCell(markCol, markRow);
                        this.pathMarks.push(pathMark);

                        pathMark.on(game.Event.MOUSE_OVER, () => pathMark.addChild(pathPoint));
                        pathMark.on(game.Event.CLICK, () => {
                            unit.moveTo(markCol, markRow);
                            this.currentMark.setCell(markCol, markRow);
                            this.pathMarks.length = 0;
                            this.removeAllMarksExceptCurrent();
                            this.emit(game.Event.MOUSE_UP);
                        });
                        pathMark.on(game.Event.MOUSE_OUT, () => pathMark.removeChild(pathPoint));
                    }
                }
            }
        }
        this.addPathMarks();
    }
}

class Mark extends game.Rectangle {

    constructor(color: number) {
        super(Unit.WIDTH - Field.LINE_WIDTH, Unit.HEIGHT - Field.LINE_WIDTH, color);
        this.interactive = true;
        this.alpha = 0.4;
    }

    setCell(col: number, row: number) {
        this.x = col * Unit.WIDTH + Field.LINE_WIDTH;
        this.y = row * Unit.HEIGHT + Field.LINE_WIDTH;
    }
}
