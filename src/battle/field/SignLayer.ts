import Field from "./Field";
import FieldManager from "./FieldManager";
import Unit from "../unit/Unit";
import * as game from "../../game";

export default class SignLayer extends PIXI.Container {

    private readonly selectedPath = new Array<game.Direction>(0);

    private readonly currentMark = new Mark(0x00FF00);
    private readonly pathMarks = new Array<Mark>(0);

    private readonly markLayer = new PIXI.Container();
    private readonly pathLayer = new PIXI.Container();

    constructor(private readonly fieldManager: FieldManager) {
        super();
        this.markLayer.addChild(this.currentMark);
        this.addChild(this.markLayer);
        this.addChild(this.pathLayer);
        this.createMarksForUnit(fieldManager.unitManager.currentUnit);

        fieldManager.on(FieldManager.PATHS_READY, (unit: Unit) => this.createMarksForUnit(unit));
        fieldManager.unitManager.on(Unit.PREPARED_TO_SHOT, (unit: Unit) => {
            this.removeAllMarksExceptCurrent();
            for (const target of this.fieldManager.unitManager.units.filter(target => unit.isLeft != target.isLeft)) {
                const mark = new Mark(0xFF0000);
                mark.setCell(target.col, target.row);
                this.markLayer.addChild(mark);
            }
        });
        fieldManager.unitManager.on(Unit.NOT_PREPARED_TO_SHOT, () => this.addPathMarks());
    }

    private removeAllMarksExceptCurrent() {
        this.markLayer.removeChildren();
        this.markLayer.addChild(this.currentMark);
    }

    private createMarksForUnit(unit: Unit) {
        this.currentMark.setCell(unit.col, unit.row);
        this.pathMarks.length = 0;
        for (const cell of this.fieldManager.findNeighborsForCell(
            new PIXI.Point(unit.col, unit.row), unit.movementPoints)) {
            if (!this.fieldManager.map[cell.x][cell.y]) {
                const pathMark = new Mark(0xFFFF00);
                pathMark.setCell(cell.x, cell.y);
                this.pathMarks.push(pathMark);

                pathMark.on(game.Event.MOUSE_OVER, () =>
                    this.preparePath(cell, new PIXI.Point(unit.col, unit.row)));
                pathMark.on(game.Event.CLICK, () => {
                    unit.path = this.selectedPath;
                    this.pathLayer.removeChildren();
                    this.emit(game.Event.MOUSE_UP);
                    unit.once(game.Event.READY, () => this.fieldManager.createPathsForUnit(unit));
                });
                pathMark.on(game.Event.MOUSE_OUT, () => this.pathLayer.removeChildren());
            }
        }
        this.addPathMarks();
    }

    private preparePath(markCell: PIXI.Point, unitCell: PIXI.Point) {
        this.selectedPath.length = 0;
        if (this.fieldManager.paths[markCell.x][markCell.y]) {
            let cell: PIXI.Point = markCell;
            while (!(cell.x == unitCell.x && cell.y == unitCell.y)) {
                const previousCell: PIXI.Point = this.fieldManager.paths[cell.x][cell.y];
                const pathLine = new game.Rectangle(5, 5, 0x00FF00);
                pathLine.x = cell.x * Unit.WIDTH;
                pathLine.y = cell.y * Unit.HEIGHT;
                if (cell.x == previousCell.x - 1 || cell.x == previousCell.x + 1) {
                    pathLine.width = Unit.WIDTH;
                    pathLine.pivot.y = pathLine.height / 2;
                    let k;
                    if (cell.x < previousCell.x) {
                        k = 1;
                        this.selectedPath.push(game.Direction.Left);
                    } else {
                        k = -1;
                        this.selectedPath.push(game.Direction.Right);
                    }
                    pathLine.x += pathLine.width / 2 * k;
                    pathLine.y += Unit.HEIGHT / 2;
                } else if (cell.y == previousCell.y - 1 || cell.y == previousCell.y + 1) {
                    pathLine.height = Unit.HEIGHT;
                    pathLine.pivot.x = pathLine.width / 2;
                    pathLine.x += Unit.WIDTH / 2;
                    let k;
                    if (cell.y < previousCell.y) {
                        k = 1;
                        this.selectedPath.push(game.Direction.Down);
                    } else {
                        k = -1;
                        this.selectedPath.push(game.Direction.Up);
                    }
                    pathLine.y += pathLine.height / 2 * k;
                }
                this.pathLayer.addChild(pathLine);
                cell = previousCell;
            }
            const pathPoint = new game.Rectangle(15, 15, 0x00FF00);
            pathPoint.pivot.set(pathPoint.width / 2, pathPoint.height / 2);
            pathPoint.x = (markCell.x + game.CENTER) * Unit.WIDTH;
            pathPoint.y = (markCell.y + game.CENTER) * Unit.HEIGHT;
            this.pathLayer.addChild(pathPoint);
        }
    }

    private addPathMarks() {
        this.removeAllMarksExceptCurrent();
        for (const mark of this.pathMarks) {
            this.markLayer.addChild(mark);
        }
    }
}

class Mark extends game.Rectangle {

    private _col: number;
    private _row: number;

    constructor(color: number) {
        super(Unit.WIDTH - Field.LINE_WIDTH, Unit.HEIGHT - Field.LINE_WIDTH, color);
        this.interactive = true;
        this.alpha = 0.4;
    }

    get col(): number {
        return this._col;
    }

    get row(): number {
        return this._row;
    }

    setCell(col: number, row: number) {
        this._col = col;
        this._row = row;
        this.x = col * Unit.WIDTH + Field.LINE_WIDTH;
        this.y = row * Unit.HEIGHT + Field.LINE_WIDTH;
    }
}
