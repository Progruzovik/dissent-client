import Unit from "./Unit";
import UnitManager from "./UnitManager";
import * as game from "../game";

export default class Field extends game.Actor {

    static readonly CELL_WIDTH = 68;
    static readonly CELL_HEIGHT = 36;
    static readonly LINE_WIDTH = 2;

    private isMouseDown = false;
    private mouseX: number;
    private mouseY: number;

    private readonly content = new game.Actor();
    private readonly markLayer: MarkLayer;

    constructor(private readonly unitManager: UnitManager,
        colsCount: number, rowsCount: number, freeWidth: number, freeHeight: number) {
        super();
        this.interactive = true;
        this.markLayer = new MarkLayer(colsCount, rowsCount);

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
        this.content.addChild(this.markLayer);
        for (const unit of unitManager.getUnits()) {
            this.content.addChild(unit);

            unit.on(Unit.PREPARED_TO_SHOT, () => {
                this.markLayer.removeAllMarksExceptCurrent();
                for (const target of this.unitManager.getUnits()) {
                    if (unit.checkLeft() != target.checkLeft()) {
                        const mark = new Mark(0xFF0000);
                        mark.setCell(target.getCol(), target.getRow());
                        this.markLayer.addChild(mark);
                    }
                }
            });
            unit.on(Unit.NOT_PREPARED_TO_SHOT, () => {
                this.markLayer.removeAllMarksExceptCurrent();
                this.markLayer.addPathMarks();
            });
        }
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
                    if (leftBorder > game.INDENT) {
                        this.content.x = game.INDENT;
                    } else if (this.content.x < leftBorder) {
                        this.content.x = leftBorder;
                    }
                }
                this.content.y += e.data.global.y - this.mouseY;
                if (this.content.y > game.INDENT) {
                    this.content.y = game.INDENT;
                } else {
                    const topBorder: number = freeHeight - this.content.height - game.INDENT;
                    if (topBorder > game.INDENT) {
                        this.content.y = game.INDENT;
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
        this.unitManager.on(UnitManager.NEXT_TURN, () => {
            this.markLayer.removeAllMarksExceptCurrent();
            this.markLayer.createPathMarks(this.unitManager.getCurrentUnit());
            this.markLayer.addPathMarks();
        });
    }
}

class MarkLayer extends PIXI.Container {

    private readonly current = new Mark(0x00FF00);
    private readonly pathMarks: Mark[] = [];

    constructor(private readonly colsCount: number, private readonly rowsCount: number) {
        super();
        this.addChild(this.current);
    }

    createPathMarks(unit: Unit) {
        this.current.setCell(unit.getCol(), unit.getRow());
        this.pathMarks.length = 0;
        for (let i = 0; i < unit.getSpeed(); i++) {
            for (let j = 1; j <= unit.getSpeed() - i; j++) {
                for (let k = 0; k < 4; k++) {
                    let markCol: number = unit.getCol(), markRow: number = unit.getRow();
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

                    if (markCol > -1 && markCol < this.colsCount && markRow > -1 && markRow < this.rowsCount) {
                        const pathMark = new Mark(0xFFFF00);
                        pathMark.setCell(markCol, markRow);
                        this.pathMarks.push(pathMark);

                        pathMark.on(game.Event.MOUSE_OVER, () => pathMark.drawRectangle(0x00FF00));
                        pathMark.on(game.Event.MOUSE_OUT, () => pathMark.drawRectangle(0xFFFF00));
                    }
                }
            }
        }
    }

    addPathMarks() {
        for (const mark of this.pathMarks) {
            this.addChild(mark);
        }
    }

    removeAllMarksExceptCurrent() {
        this.removeChildren();
        this.addChild(this.current);
    }
}

class Mark extends game.Rectangle {

    constructor(color: number) {
        super(Field.CELL_WIDTH - Field.LINE_WIDTH, Field.CELL_HEIGHT - Field.LINE_WIDTH, color);
        this.interactive = true;
        this.alpha = 0.4;
    }

    setCell(col: number, row: number) {
        this.x = col * Field.CELL_WIDTH + Field.LINE_WIDTH;
        this.y = row * Field.CELL_HEIGHT + Field.LINE_WIDTH;
    }
}
