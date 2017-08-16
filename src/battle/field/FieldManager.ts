import Unit from "../unit/Unit";
import UnitManager from "../unit/UnitManager";
import { CellStatus } from "./utils"
import * as PIXI from "pixi.js";

export default class FieldManager extends PIXI.utils.EventEmitter {

    static readonly PATHS_READY = "pathsReady";

    readonly paths = new Array<Array<PIXI.Point>>(this.colsCount);
    readonly map = new Array<Array<CellStatus>>(this.colsCount);

    constructor(readonly colsCount: number, readonly rowsCount: number, readonly unitManager: UnitManager) {
        super();
        for (let i = 0; i < this.colsCount; i++) {
            this.paths[i] = new Array<PIXI.Point>(this.rowsCount);
            this.map[i] = new Array<CellStatus>(this.rowsCount);
            for (let j = 0; j < this.rowsCount; j++) {
                this.map[i][j] = CellStatus.Empty;
            }
        }
        for (const unit of unitManager.units) {
            this.map[unit.col][unit.row] = CellStatus.Ship;
        }
        this.createPathsForUnit(unitManager.currentUnit);
        unitManager.on(UnitManager.NEXT_TURN, (currentUnit: Unit) => this.createPathsForUnit(currentUnit));
        unitManager.on(Unit.MOVE, (oldPosition: PIXI.Point, newPosition: PIXI.Point) => {
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
        return result.filter(cell => cell.x > -1 && cell.x < this.colsCount && cell.y > -1 && cell.y < this.rowsCount);
    }

    createPathsForUnit(unit: Unit) {
        const unitCell = unit.cell;
        const distances = new Array<Array<number>>(this.colsCount);
        for (let i = 0; i < this.colsCount; i++) {
            distances[i] = new Array<number>(this.rowsCount);
            for (let j = 0; j < this.rowsCount; j++) {
                distances[i][j] = Number.MAX_VALUE;
                this.paths[i][j] = null;
            }
        }
        distances[unitCell.x][unitCell.y] = 0;
        this.paths[unitCell.x][unitCell.y] = unitCell;

        const cellQueue = new Array<PIXI.Point>(0);
        cellQueue.push(unitCell);
        while (cellQueue.length != 0) {
            const cell: PIXI.Point = cellQueue.pop();
            for (const neighborCell of this.findNeighborsForCell(cell, 1)) {
                if (unit.calculateDistanceToCell(neighborCell) <= unit.movementPoints
                    && distances[neighborCell.x][neighborCell.y] > distances[cell.x][cell.y] + 1) {
                    distances[neighborCell.x][neighborCell.y] = distances[cell.x][cell.y] + 1;
                    this.paths[neighborCell.x][neighborCell.y] = cell;
                    cellQueue.push(neighborCell);
                }
            }
        }
        this.emit(FieldManager.PATHS_READY, unit);
    }
}
