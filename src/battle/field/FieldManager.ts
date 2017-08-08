import Unit from "../unit/Unit";
import UnitManager from "../unit/UnitManager";
import * as PIXI from "pixi.js";

export default class FieldManager extends PIXI.utils.EventEmitter {

    static readonly PATHS_READY = "pathsReady";

    readonly paths = new Array<Array<PIXI.Point>>(0);

    constructor(readonly colsCount: number, readonly rowsCount: number, readonly unitManager: UnitManager) {
        super();
        this.createPathsForUnit(unitManager.currentUnit);
        unitManager.on(UnitManager.NEXT_TURN, (currentUnit: Unit) => this.createPathsForUnit(currentUnit));
    }

    findNeighborsForCell(cell: PIXI.Point, radius: number): PIXI.Point[] {
        const result = new Array<PIXI.Point>(0);
        for (let i = 0; i < radius; i++) {
            for (let j = 1; j <= radius - i; j++) {
                result.push(new PIXI.Point(cell.x + j, cell.y + i), new PIXI.Point(cell.x - i, cell.y + j),
                    new PIXI.Point(cell.x - j, cell.y - i), new PIXI.Point(cell.x + i, cell.y - j));
            }
        }
        return result.filter(cell => cell.x > -1 && cell.x < this.colsCount && cell.y > -1 && cell.y < this.rowsCount);
    }

    createPathsForUnit(unit: Unit) {
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
