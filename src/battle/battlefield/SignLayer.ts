import Field from "./Field";
import Unit from "./Unit";
import UnitManager from "./UnitManager";
import * as game from "../../game";

export default class SignLayer extends PIXI.Container {

    private readonly paths = new Array<Array<PIXI.Point>>(0);
    private readonly currentPath = new Array<game.Direction>(0);

    private readonly currentMark = new Mark(0x00FF00);
    private readonly pathMarks = new Array<Mark>(0);

    private readonly markLayer = new PIXI.Container();
    private readonly pathLayer = new PIXI.Container();

    constructor(private readonly colsCount: number, private readonly rowsCount: number,
                private readonly unitManager: UnitManager) {
        super();
        this.markLayer.addChild(this.currentMark);
        this.addChild(this.markLayer);
        this.addChild(this.pathLayer);
        this.createPathsAndMarksForUnit(unitManager.currentUnit);
        unitManager.on(UnitManager.NEXT_TURN, (currentUnit: Unit) => this.createPathsAndMarksForUnit(currentUnit));
    }

    addPathMarks() {
        this.removeAllMarksExceptCurrent();
        for (const mark of this.pathMarks) {
            this.markLayer.addChild(mark);
        }
    }

    markTargets(isLeft: boolean) {
        this.removeAllMarksExceptCurrent();
        for (const target of this.unitManager.units.filter((target: Unit) => isLeft == target.isLeft)) {
            const mark = new Mark(0xFF0000);
            mark.setCell(target.col, target.row);
            this.markLayer.addChild(mark);
        }
    }

    private checkCellValid(cell: PIXI.Point): boolean {
        return cell.x > -1 && cell.x < this.colsCount && cell.y > -1 && cell.y < this.rowsCount;
    }

    private removeAllMarksExceptCurrent() {
        this.markLayer.removeChildren();
        this.markLayer.addChild(this.currentMark);
    }

    private createPathsAndMarksForUnit(unit: Unit) {
        const unitCell = new PIXI.Point(unit.col, unit.row);
        const distances = new Array<Array<number>>(0);
        this.paths.length = 0;
        for (let i = 0; i < this.rowsCount; i++) {
            distances.push(new Array<number>(0));
            for (let j = 0; j < this.colsCount; j++) {
                distances[i].push(Number.MAX_VALUE);
            }
            this.paths.push(new Array<PIXI.Point>(this.colsCount));
        }
        const cellQueue = new Array<PIXI.Point>(0);
        distances[unitCell.x][unitCell.y] = 0;
        this.paths[unitCell.x][unitCell.y] = unitCell;
        cellQueue.push(unitCell);

        while (cellQueue.length != 0) {
            const cell: PIXI.Point = cellQueue.pop();
            const neighborCells = [new PIXI.Point(cell.x - 1, cell.y), new PIXI.Point(cell.x + 1, cell.y),
                new PIXI.Point(cell.x, cell.y - 1), new PIXI.Point(cell.x, cell.y + 1)];
            for (const neighborCell of neighborCells) {
                if (this.checkCellValid(neighborCell) && unit.checkReachable(neighborCell.x, neighborCell.y)
                    && distances[neighborCell.x][neighborCell.y] > distances[cell.x][cell.y] + 1) {
                    distances[neighborCell.x][neighborCell.y] = distances[cell.x][cell.y] + 1;
                    this.paths[neighborCell.x][neighborCell.y] = cell;
                    cellQueue.push(neighborCell);
                }
            }
        }

        this.currentMark.setCell(unit.col, unit.row);
        this.pathMarks.length = 0;
        for (let i = 0; i < unit.movementPoints; i++) {
            for (let j = 1; j <= unit.movementPoints - i; j++) {
                const currentMarks = [new PIXI.Point(unit.col + j, unit.row + i),
                    new PIXI.Point(unit.col - i, unit.row + j), new PIXI.Point(unit.col - j, unit.row - i),
                    new PIXI.Point(unit.col + i, unit.row - j)];
                for (const mark of currentMarks) {
                    if (this.checkCellValid(mark)) {
                        const pathMark = new Mark(0xFFFF00);
                        pathMark.setCell(mark.x, mark.y);
                        this.pathMarks.push(pathMark);

                        pathMark.on(game.Event.MOUSE_OVER, () =>
                            this.preparePath(mark, new PIXI.Point(unit.col, unit.row)));
                        pathMark.on(game.Event.CLICK, () => {
                            unit.path = this.currentPath;
                            this.pathLayer.removeChildren();
                            this.emit(game.Event.MOUSE_UP);
                            unit.once(game.Event.READY, () => this.createPathsAndMarksForUnit(unit));
                        });
                        pathMark.on(game.Event.MOUSE_OUT, () => this.pathLayer.removeChildren());
                    }
                }
            }
        }
        this.addPathMarks();
    }

    private preparePath(markCell: PIXI.Point, unitCell: PIXI.Point) {
        this.currentPath.length = 0;
        if (this.paths[markCell.x][markCell.y]) {
            let cell: PIXI.Point = markCell;
            while (!(cell.x == unitCell.x && cell.y == unitCell.y)) {
                const previousCell: PIXI.Point = this.paths[cell.x][cell.y];
                const pathLine = new game.Rectangle(5, 5, 0x00FF00);
                pathLine.x = cell.x * Unit.WIDTH;
                pathLine.y = cell.y * Unit.HEIGHT;
                if (cell.x == previousCell.x - 1 || cell.x == previousCell.x + 1) {
                    pathLine.width = Unit.WIDTH;
                    pathLine.pivot.y = pathLine.height / 2;
                    let k;
                    if (cell.x < previousCell.x) {
                        k = 1;
                        this.currentPath.push(game.Direction.Left);
                    } else {
                        k = -1;
                        this.currentPath.push(game.Direction.Right);
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
                        this.currentPath.push(game.Direction.Down);
                    } else {
                        k = -1;
                        this.currentPath.push(game.Direction.Up);
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
