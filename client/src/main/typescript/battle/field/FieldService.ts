import Unit from "../unit/Unit";
import UnitService from "../unit/UnitService";
import { getPaths, Point } from "../request";
import { CellStatus } from "../util"
import * as game from "../../game";

export default class FieldService extends PIXI.utils.EventEmitter {

    static readonly PATHS_READY = "pathsReady";
    static readonly PATH_LINE = "pathLine";
    static readonly GUN_CELLS_READY = "gunCellsReady";

    readonly currentPath = new Array<game.Direction>(0);
    private paths: Point[][];

    readonly map: CellStatus[][] = new Array<CellStatus[]>(this.size.x);

    constructor(readonly size: PIXI.Point, readonly unitService: UnitService, fieldObjects: Point[]) {
        super();
        for (let i = 0; i < this.size.x; i++) {
            this.map[i] = new Array<CellStatus>(this.size.y);
            for (let j = 0; j < this.map[i].length; j++) {
                this.map[i][j] = CellStatus.Empty;
            }
        }
        for (const unit of unitService.units) {
            this.map[unit.cell.x][unit.cell.y] = CellStatus.Ship;
        }
        for (const object of fieldObjects) {
            this.map[object.x][object.y] = CellStatus.Obstacle;
        }

        this.unitService.on(UnitService.NEXT_TURN, () => this.getPathsForCurrentUnit());
        this.unitService.on(Unit.MOVE, (oldPosition: PIXI.Point, newPosition: PIXI.Point) => {
            this.map[oldPosition.x][oldPosition.y] = CellStatus.Empty;
            this.map[newPosition.x][newPosition.y] = CellStatus.Ship;
        });
        this.unitService.on(Unit.PREPARED_TO_SHOT, (unit: Unit) => {
            let gunCells = this.findNeighborsInRadius(unit.cell, unit.preparedGun.radius,
                (cell: PIXI.Point) => {
                const cellsInBetween = this.findCellsInBetween(unit.cell.clone(), cell);
                let isCellReachable = true;
                let i = 1;
                while (isCellReachable && i < cellsInBetween.length - 1) {
                    if (this.map[cellsInBetween[i].x][cellsInBetween[i].y] != CellStatus.Empty) {
                        isCellReachable = false;
                    }
                    i++;
                }
                return isCellReachable;
            });
            this.emit(FieldService.GUN_CELLS_READY, unit, gunCells);
        });
    }

    findAvailableNeighborsInRadius(cell: PIXI.Point, radius: number): PIXI.Point[] {
        return this.findNeighborsInRadius(cell, radius, cell =>
                this.map[cell.x][cell.y] == CellStatus.Empty && this.paths[cell.x][cell.y] != null);
    }

    getPathsForCurrentUnit() {
        getPaths(paths => {
            this.paths = paths;
            this.emit(FieldService.PATHS_READY, this.unitService.currentUnit);
        });
    }

    preparePath(markCell: PIXI.Point, unitCell: PIXI.Point) {
        this.currentPath.length = 0;
        if (this.paths[markCell.x][markCell.y]) {
            let cell: Point = markCell;
            while (!(cell.x == unitCell.x && cell.y == unitCell.y)) {
                const previousCell: Point = this.paths[cell.x][cell.y];
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
                this.emit(FieldService.PATH_LINE, cell, direction);
                cell = previousCell;
            }
        }
    }

    private findNeighborsInRadius(cell: PIXI.Point, radius: number,
                                  filterCondition: (cell: PIXI.Point) => boolean = () => true): PIXI.Point[] {
        const result = new Array<PIXI.Point>(0);
        for (let i = 0; i < radius; i++) {
            for (let j = 1; j <= radius - i; j++) {
                result.push(new PIXI.Point(cell.x + i, cell.y - j), new PIXI.Point(cell.x - i, cell.y + j),
                    new PIXI.Point(cell.x + j, cell.y + i), new PIXI.Point(cell.x - j, cell.y - i));
            }
        }
        return result.filter(cell => cell.x > -1 && cell.x < this.size.x
            && cell.y > -1 && cell.y < this.size.y && filterCondition(cell));
    }

    private findCellsInBetween(firstCell: PIXI.Point, lastCell: PIXI.Point): PIXI.Point[] {
        const dx: number = lastCell.x - firstCell.x, dy: number = lastCell.y - firstCell.y;
        if (dx > -2 && dx < 2 && dy > -2 && dy < 2) {
            return [firstCell, lastCell];
        }

        const firstCenterCell = new PIXI.Point(firstCell.x + (lastCell.x - firstCell.x) / 2,
            firstCell.y + (lastCell.y - firstCell.y) / 2);
        const secondCenterCell = new PIXI.Point();
        if (firstCenterCell.x % 1 == 0) {
            secondCenterCell.x = firstCenterCell.x;
        } else {
            if (firstCell.x < lastCell.x) {
                firstCenterCell.x = Math.floor(firstCenterCell.x);
                secondCenterCell.x = firstCenterCell.x + 1;
            } else {
                firstCenterCell.x = Math.ceil(firstCenterCell.x);
                secondCenterCell.x = firstCenterCell.x - 1;
            }
        }
        if (firstCenterCell.y % 1 == 0) {
            secondCenterCell.y = firstCenterCell.y;
        } else {
            if (firstCell.y < lastCell.y) {
                firstCenterCell.y = Math.floor(firstCenterCell.y);
                secondCenterCell.y = firstCenterCell.y + 1;
            } else {
                firstCenterCell.y = Math.ceil(firstCenterCell.y);
                secondCenterCell.y = firstCenterCell.y - 1;
            }
        }

        const result: PIXI.Point[] = this.findCellsInBetween(firstCell, firstCenterCell);
        const firstCellWithOffsetIndex: number = result.length - 2;
        if (firstCenterCell.x != secondCenterCell.x || firstCenterCell.y != secondCenterCell.y) {
            result.push(secondCenterCell);
        }
        let element: PIXI.Point = secondCenterCell.clone();
        for (let i = firstCellWithOffsetIndex; i > -1; i--) {
            element.x += result[i + 1].x - result[i].x;
            element.y += result[i + 1].y - result[i].y;
            result.push(element);
            element = element.clone();
        }
        return result;
    }
}
