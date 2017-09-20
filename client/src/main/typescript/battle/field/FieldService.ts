import Unit from "../unit/Unit";
import UnitService from "../unit/UnitService";
import { getCurrentShotCells, getCurrentPaths, Cell } from "../request";
import * as game from "../../game";

export default class FieldService extends PIXI.utils.EventEmitter {

    static readonly PATHS_READY = "pathsReady";
    static readonly PATH_LINE = "pathLine";
    static readonly SHOT_CELLS_READY = "shotCellsReady";

    readonly currentPath = new Array<game.Direction>(0);
    private paths: Cell[][];

    constructor(readonly size: PIXI.Point, readonly unitService: UnitService) {
        super();
        this.unitService.on(UnitService.NEXT_TURN, () => this.getPathsForCurrentUnit());
        this.unitService.on(Unit.PREPARED_TO_SHOT, (unit: Unit) => {
            getCurrentShotCells(unit.preparedGun == unit.firstGun ? 0 : 1, (shotCells, targetCells) =>
                this.emit(FieldService.SHOT_CELLS_READY, unit, shotCells, targetCells));
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
