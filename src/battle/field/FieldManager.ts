import Unit from "../unit/Unit";
import UnitManager from "../unit/UnitManager";
import { CellStatus } from "./utils"
import * as game from "../../game";

export default class FieldManager extends PIXI.utils.EventEmitter {

    static readonly PATHS_READY = "pathsReady";
    static readonly PATH_LINE = "pathLine";

    readonly currentPath = new Array<game.Direction>(0);
    readonly paths = new Array<PIXI.Point[]>(this.colsCount);

    constructor(readonly colsCount: number, readonly rowsCount: number,
                readonly map: CellStatus[][], readonly unitManager: UnitManager) {
        super();
        for (let i = 0; i < this.colsCount; i++) {
            this.paths[i] = new Array<PIXI.Point>(this.rowsCount);
        }
        for (const unit of unitManager.units) {
            this.map[unit.cell.x][unit.cell.y] = CellStatus.Ship;
        }
        this.createPathsForUnit(unitManager.currentUnit);

        this.unitManager.on(UnitManager.NEXT_TURN, (currentUnit: Unit) => this.createPathsForUnit(currentUnit));
        this.unitManager.on(Unit.MOVE, (oldPosition: PIXI.Point, newPosition: PIXI.Point) => {
            this.map[oldPosition.x][oldPosition.y] = CellStatus.Empty;
            this.map[newPosition.x][newPosition.y] = CellStatus.Ship;
        });
    }

    findNeighborsForCell(cell: PIXI.Point, radius: number): PIXI.Point[] {
        const result = new Array<PIXI.Point>(0);
        for (let i = 0; i < radius; i++) {
            for (let j = 1; j <= radius - i; j++) {
                result.push(new PIXI.Point(cell.x + i, cell.y - j), new PIXI.Point(cell.x - i, cell.y + j),
                    new PIXI.Point(cell.x + j, cell.y + i), new PIXI.Point(cell.x - j, cell.y - i));
            }
        }
        return result.filter(cell => cell.x > -1 && cell.x < this.colsCount
            && cell.y > -1 && cell.y < this.rowsCount);
    }

    createPathsForUnit(unit: Unit) {
        const distances = new Array<number[]>(this.colsCount);
        for (let i = 0; i < this.colsCount; i++) {
            distances[i] = new Array<number>(this.rowsCount);
            for (let j = 0; j < this.rowsCount; j++) {
                distances[i][j] = Number.MAX_VALUE;
                this.paths[i][j] = null;
            }
        }
        const unitCell = unit.cell.clone();
        distances[unitCell.x][unitCell.y] = 0;
        this.paths[unitCell.x][unitCell.y] = unitCell;

        const cellQueue = new Array<PIXI.Point>(0);
        cellQueue.push(unitCell);
        while (cellQueue.length != 0) {
            const cell: PIXI.Point = cellQueue.pop();
            if (distances[cell.x][cell.y] < unit.movementPoints) {
                for (const neighborCell of this.findNeighborsForCell(cell, 1)) {
                    const neighborStatus: CellStatus = this.map[neighborCell.x][neighborCell.y];
                    if ((neighborStatus == CellStatus.Empty || neighborStatus == CellStatus.Ship)
                        && distances[neighborCell.x][neighborCell.y] > distances[cell.x][cell.y] + 1) {
                        distances[neighborCell.x][neighborCell.y] = distances[cell.x][cell.y] + 1;
                        this.paths[neighborCell.x][neighborCell.y] = cell;
                        cellQueue.push(neighborCell);
                    }
                }
            }
        }
        this.emit(FieldManager.PATHS_READY, unit);
    }

    preparePath(markCell: PIXI.Point, unitCell: PIXI.Point) {
        this.currentPath.length = 0;
        if (this.paths[markCell.x][markCell.y]) {
            let cell: PIXI.Point = markCell;
            while (!(cell.x == unitCell.x && cell.y == unitCell.y)) {
                const previousCell: PIXI.Point = this.paths[cell.x][cell.y];
                let direction: game.Direction;
                if (cell.x == previousCell.x - 1) {
                    direction = game.Direction.Left;
                } else if (cell.x == previousCell.x + 1) {
                    direction = game.Direction.Right;
                } else if (cell.y == previousCell.y - 1) {
                    direction = game.Direction.Up;
                } else if (cell.y == previousCell.y + 1) {
                    direction = game.Direction.Down;
                }
                this.currentPath.push(direction);
                this.emit(FieldManager.PATH_LINE, cell, direction);
                cell = previousCell;
            }
        }
    }
}
