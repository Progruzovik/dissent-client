import Field from "./Field";
import FieldManager from "./FieldManager";
import Unit from "../unit/Unit";
import { CellStatus } from "./utils";
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
        this.createCommonMarksForUnit(fieldManager.unitManager.currentUnit);

        fieldManager.on(FieldManager.PATHS_READY, (unit: Unit) => this.createCommonMarksForUnit(unit));
        fieldManager.unitManager.on(Unit.PREPARED_TO_SHOT, (unit: Unit) => this.addTargetMarksForUnit(unit));
        fieldManager.unitManager.on(Unit.NOT_PREPARED_TO_SHOT, () => this.addCurrentPathMarks());
    }

    private removeAllMarksExceptCurrent() {
        this.markLayer.removeChildren();
        this.markLayer.addChild(this.currentMark);
    }

    private createCommonMarksForUnit(unit: Unit) {
        this.currentMark.cell = unit.cell;
        this.pathMarks.length = 0;
        for (const cell of this.fieldManager.findNeighborsForCell(unit.cell, unit.movementPoints)) {
            if (this.fieldManager.map[cell.x][cell.y] == CellStatus.Empty) {
                const pathMark = new Mark(0xFFFF00, cell);
                this.pathMarks.push(pathMark);

                pathMark.on(game.Event.MOUSE_OVER, () => this.preparePath(cell, unit.cell));
                pathMark.on(game.Event.CLICK, () => {
                    unit.path = this.selectedPath;
                    this.pathLayer.removeChildren();
                    this.emit(game.Event.MOUSE_UP);
                    unit.once(game.Event.READY, () => this.fieldManager.createPathsForUnit(unit));
                });
                pathMark.on(game.Event.MOUSE_OUT, () => this.pathLayer.removeChildren());
            }
        }
        this.addCurrentPathMarks();
    }

    private addCurrentPathMarks() {
        this.removeAllMarksExceptCurrent();
        for (const mark of this.pathMarks) {
            this.markLayer.addChild(mark);
        }
    }

    private addTargetMarksForUnit(unit: Unit) {
        this.removeAllMarksExceptCurrent();
        const targets: Unit[] = this.fieldManager.unitManager.units.filter(target => unit.canHit(target));
        for (const cell of this.fieldManager.findNeighborsForCell(unit.cell, unit.ship.shootRadius)) {
            if (this.fieldManager.map[cell.x][cell.y] == CellStatus.Empty) {
                this.markLayer.addChild(new Mark(0xFFFFFF, cell));
            } else if (this.fieldManager.map[cell.x][cell.y] == CellStatus.Ship) {
                if (targets.some(target => target.col == cell.x && target.row == cell.y)) {
                    this.markLayer.addChild(new Mark(0xFF0000, cell));
                }
            }
        }
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
}

class Mark extends game.Rectangle {

    private col: number;
    private row: number;

    constructor(color: number, cell: PIXI.Point = null) {
        super(Unit.WIDTH - Field.LINE_WIDTH, Unit.HEIGHT - Field.LINE_WIDTH, color);
        this.interactive = true;
        this.alpha = 0.4;
        if (cell) {
            this.cell = cell;
        }
    }

    set cell(value: PIXI.Point) {
        this.col = value.x;
        this.row = value.y;
        this.x = value.x * Unit.WIDTH + Field.LINE_WIDTH;
        this.y = value.y * Unit.HEIGHT + Field.LINE_WIDTH;
    }
}
