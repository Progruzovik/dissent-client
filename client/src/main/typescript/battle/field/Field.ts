import FieldService from "./FieldService";
import Mark from "./Mark";
import ProjectileService from "../gun/ProjectileService";
import Unit from "../unit/Unit";
import { CellStatus } from "../utils";
import * as game from "../../game";

export default class Field extends PIXI.Container {

    static readonly LINE_WIDTH = 1.5;

    private readonly currentMark = new Mark(0x00FF00);
    private readonly pathMarks = new Array<Mark>(0);
    private readonly markLayer = new PIXI.Container();
    private readonly pathLayer = new PIXI.Container();

    constructor(private readonly projectileService: ProjectileService,
                private readonly fieldService: FieldService, fieldObjects: PIXI.Point[]) {
        super();
        this.createCommonMarksForUnit(fieldService.unitService.currentUnit);

        const bg = new game.Rectangle();
        this.addChild(bg);
        for (let i = 0; i <= fieldService.size.y; i++) {
            const line = new game.Rectangle(0x777777,
                fieldService.size.x * Unit.WIDTH + Field.LINE_WIDTH, Field.LINE_WIDTH);
            line.y = i * Unit.HEIGHT;
            this.addChild(line);
        }
        for (let i = 0; i <= fieldService.size.y; i++) {
            const line = new game.Rectangle(0x777777,
                Field.LINE_WIDTH, fieldService.size.y * Unit.HEIGHT + Field.LINE_WIDTH);
            line.x = i * Unit.WIDTH;
            this.addChild(line);
        }
        for (const object of fieldObjects) {
            const spriteAsteroid = new PIXI.Sprite(PIXI.loader.resources["asteroid"].texture);
            spriteAsteroid.x = object.x * Unit.WIDTH;
            spriteAsteroid.y = object.y * Unit.HEIGHT;
            this.addChild(spriteAsteroid);
        }
        bg.width = this.width;
        bg.height = this.height;

        this.markLayer.addChild(this.currentMark);
        this.addChild(this.markLayer);
        this.addChild(this.pathLayer);
        for (const unit of fieldService.unitService.units) {
            this.addChild(unit);
        }

        this.projectileService.on(Unit.SHOT, (projectile: game.Actor) => this.addChild(projectile));
        this.fieldService.on(FieldService.PATHS_READY, (unit: Unit) => this.createCommonMarksForUnit(unit));
        this.fieldService.on(FieldService.PATH_LINE, (cell: PIXI.Point, direction: game.Direction) => {
            const pathLine = new game.Rectangle(0x00FF00, 5, 5);
            pathLine.x = cell.x * Unit.WIDTH;
            pathLine.y = cell.y * Unit.HEIGHT;
            let k = 0;
            if (direction == game.Direction.Left || direction == game.Direction.Right) {
                pathLine.width = Unit.WIDTH;
                pathLine.pivot.y = pathLine.height / 2;
                k = direction == game.Direction.Left ? 1 : -1;
                pathLine.x += pathLine.width / 2 * k;
                pathLine.y += Unit.HEIGHT / 2;
            } else if (direction == game.Direction.Up || direction == game.Direction.Down) {
                pathLine.height = Unit.HEIGHT;
                pathLine.pivot.x = pathLine.width / 2;
                pathLine.x += Unit.WIDTH / 2;
                k = direction == game.Direction.Up ? 1 : -1;
                pathLine.y += pathLine.height / 2 * k;
            }
            this.pathLayer.addChild(pathLine);
        });
        this.fieldService.on(FieldService.GUN_CELLS_READY, (unit: Unit, gunCells: PIXI.Point[]) => {
            this.removeAllMarksExceptCurrent();
            const targets: Unit[] =
                this.fieldService.unitService.units.filter(target => unit.canHit(target));
            for (const cell of gunCells) {
                if (this.fieldService.map[cell.x][cell.y] == CellStatus.Empty) {
                    this.markLayer.addChild(new Mark(0xFFFFFF, cell));
                } else if (this.fieldService.map[cell.x][cell.y] == CellStatus.Ship) {
                    if (targets.some(target => target.cell.x == cell.x && target.cell.y == cell.y)) {
                        this.markLayer.addChild(new Mark(0xFF0000, cell));
                    }
                }
            }
        });
        this.fieldService.unitService.on(Unit.NOT_PREPARED_TO_SHOT, () => this.addCurrentPathMarks());
    }

    private removeAllMarksExceptCurrent() {
        this.markLayer.removeChildren();
        this.markLayer.addChild(this.currentMark);
    }

    private createCommonMarksForUnit(unit: Unit) {
        this.currentMark.cell = unit.cell;
        this.pathMarks.length = 0;
        for (const cell of this.fieldService.findAvailableNeighborsInRadius(unit.cell, unit.movementPoints)) {
            const pathMark = new Mark(0xFFFF00, cell);
            this.pathMarks.push(pathMark);

            pathMark.on(game.Event.MOUSE_OVER, () => {
                this.fieldService.preparePath(cell, unit.cell);
                const pathEnd = new game.Rectangle(0x00FF00, 15, 15);
                pathEnd.pivot.set(pathEnd.width / 2, pathEnd.height / 2);
                pathEnd.x = (cell.x + game.CENTER) * Unit.WIDTH;
                pathEnd.y = (cell.y + game.CENTER) * Unit.HEIGHT;
                this.pathLayer.addChild(pathEnd);
            });
            pathMark.on(game.Event.CLICK, () => {
                unit.path = this.fieldService.currentPath;
                this.pathLayer.removeChildren();
                this.emit(game.Event.MOUSE_UP);
                unit.once(Unit.MOVE, () => this.fieldService.createPathsForUnit(unit));
            });
            pathMark.on(game.Event.MOUSE_OUT, () => this.pathLayer.removeChildren());
        }
        this.addCurrentPathMarks();
    }

    private addCurrentPathMarks() {
        this.removeAllMarksExceptCurrent();
        for (const mark of this.pathMarks) {
            this.markLayer.addChild(mark);
        }
    }
}
