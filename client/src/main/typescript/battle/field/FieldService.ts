import Unit from "../unit/Unit";
import UnitService from "../unit/UnitService";
import { getCurrentShotCells, getCurrentPaths, Cell } from "../request";
import { CellStatus } from "../util"
import * as game from "../../game";

export default class FieldService extends PIXI.utils.EventEmitter {

    static readonly PATHS_READY = "pathsReady";
    static readonly PATH_LINE = "pathLine";
    static readonly GUN_CELLS_READY = "gunCellsReady";

    readonly currentPath = new Array<game.Direction>(0);
    private paths: Cell[][];

    readonly map: CellStatus[][] = new Array<CellStatus[]>(this.size.x);

    constructor(readonly size: PIXI.Point, readonly unitService: UnitService, fieldObjects: Cell[]) {
        super();
        for (let i = 0; i < this.size.x; i++) {
            this.map[i] = new Array<CellStatus>(this.size.y);
            for (let j = 0; j < this.map[i].length; j++) {
                this.map[i][j] = CellStatus.Empty;
            }
        }
        for (const unit of unitService.units) {
            this.map[unit.cell.x][unit.cell.y] = CellStatus.Unit;
        }
        for (const object of fieldObjects) {
            this.map[object.x][object.y] = CellStatus.Obstacle;
        }

        this.unitService.on(UnitService.NEXT_TURN, () => this.getPathsForCurrentUnit());
        this.unitService.on(Unit.MOVE, (oldPosition: PIXI.Point, newPosition: PIXI.Point) => {
            this.map[oldPosition.x][oldPosition.y] = CellStatus.Empty;
            this.map[newPosition.x][newPosition.y] = CellStatus.Unit;
        });
        this.unitService.on(Unit.PREPARED_TO_SHOT, (unit: Unit) => {
            getCurrentShotCells(unit.preparedGun == unit.firstGun ? 0 : 1, gunCells =>
                this.emit(FieldService.GUN_CELLS_READY, unit, gunCells));
        });
    }

    getPathsForCurrentUnit() {
        getCurrentPaths(paths => {
            this.paths = paths;
            this.emit(FieldService.PATHS_READY, this.unitService.currentUnit);
        });
    }

    preparePath(markCell: Cell, unitCell: PIXI.Point) {
        this.currentPath.length = 0;
        if (this.paths[markCell.x][markCell.y]) {
            let cell: Cell = markCell;
            while (!(cell.x == unitCell.x && cell.y == unitCell.y)) {
                const previousCell: Cell = this.paths[cell.x][cell.y];
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
}
