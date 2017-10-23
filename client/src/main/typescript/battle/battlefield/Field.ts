import ProjectileService from "./projectile/ProjectileService";
import Unit from "./unit/Unit";
import UnitService from "./unit/UnitService";
import WebSocketConnection from "../WebSocketConnection";
import { ActionType, Cell, PathNode } from "../util";
import * as game from "../../game";

export default class Field extends game.UiElement {

    static readonly LINE_WIDTH = 1.5;

    private paths: PathNode[][];

    private readonly currentMark = new Mark(0x00ff00);
    private readonly pathMarks = new Array<Mark>(0);
    private readonly pathLayer = new PIXI.Container();
    private readonly markLayer = new PIXI.Container();

    constructor(private readonly size: Cell, asteroids: Cell[], clouds: Cell[], destroyedUnits: PIXI.Sprite[],
                private readonly unitService: UnitService, private readonly projectileService: ProjectileService,
                private readonly webSocketConnection: WebSocketConnection) {
        super();

        const bg = new game.Rectangle();
        this.addChild(bg);
        for (let i = 0; i <= size.y; i++) {
            const line = new game.Rectangle(0x777777, size.x * Unit.WIDTH + Field.LINE_WIDTH, Field.LINE_WIDTH);
            line.y = i * Unit.HEIGHT;
            this.addChild(line);
        }
        for (let i = 0; i <= size.y; i++) {
            const line = new game.Rectangle(0x777777, Field.LINE_WIDTH, size.y * Unit.HEIGHT + Field.LINE_WIDTH);
            line.x = i * Unit.WIDTH;
            this.addChild(line);
        }
        bg.width = this.width;
        bg.height = this.height;

        for (const asteroid of asteroids) {
            const spriteAsteroid = new PIXI.Sprite(PIXI.loader.resources["asteroid"].texture);
            spriteAsteroid.x = asteroid.x * Unit.WIDTH;
            spriteAsteroid.y = asteroid.y * Unit.HEIGHT;
            this.addChild(spriteAsteroid);
        }
        for (const cloud of clouds) {
            const spriteCloud = new PIXI.Sprite(PIXI.loader.resources["cloud"].texture);
            spriteCloud.x = cloud.x * Unit.WIDTH;
            spriteCloud.y = cloud.y * Unit.HEIGHT;
            this.addChild(spriteCloud);
        }
        this.markLayer.addChild(this.currentMark);
        this.addChild(this.markLayer);
        this.addChild(this.pathLayer);
        for (const destroyedUnit of destroyedUnits) {
            this.addChild(destroyedUnit);
        }
        for (const unit of unitService.units) {
            this.addChild(unit);
        }

        this.unitService.on(ActionType.Move, () => this.updatePathsAndMarks());
        this.unitService.on(Unit.PREPARED_TO_SHOT, () => this.removePathsAndMarksExceptCurrent());
        this.unitService.on(UnitService.SHOT_CELL, (cell: Cell) =>
            this.markLayer.addChild(new Mark(0xffffff, cell)));
        this.unitService.on(UnitService.TARGET_CELL, (cell: Cell) =>
            this.markLayer.addChild(new Mark(0xff0000, cell)));
        this.unitService.on(Unit.NOT_PREPARED_TO_SHOT, () => this.addCurrentPathMarks());
        this.unitService.on(ActionType.NextTurn, () => this.updatePathsAndMarks());
        this.projectileService.on(ActionType.Shot, (projectile: game.Actor) => this.addChild(projectile));
    }

    removePathsAndMarksExceptCurrent() {
        this.pathLayer.removeChildren();
        this.markLayer.removeChildren();
        this.markLayer.addChild(this.currentMark);
    }

    private updatePathsAndMarks() {
        this.currentMark.cell = this.unitService.currentUnit.cell;
        if (this.unitService.isCurrentPlayerTurn) {
            this.webSocketConnection.requestReachableCellsAndPaths(d => {
                this.paths = d.paths;
                this.pathMarks.length = 0;
                for (const cell of d.reachableCells) {
                    const pathMark = new Mark(0xffff00, cell);
                    this.pathMarks.push(pathMark);

                    pathMark.on(game.Event.MOUSE_OVER, () => {
                        this.preparePath(cell, this.unitService.currentUnit.cell);
                        const pathEnd = new game.Rectangle(0x00ff00, 15, 15);
                        pathEnd.pivot.set(pathEnd.width / 2, pathEnd.height / 2);
                        pathEnd.x = (cell.x + game.CENTER) * Unit.WIDTH;
                        pathEnd.y = (cell.y + game.CENTER) * Unit.HEIGHT;
                        this.pathLayer.addChild(pathEnd);
                    });
                    pathMark.on(game.Event.CLICK, () => this.webSocketConnection.moveCurrentUnit(cell));
                    pathMark.on(game.Event.MOUSE_OUT, () => this.pathLayer.removeChildren());
                }
                this.addCurrentPathMarks();
            });
        }
    }

    private preparePath(markCell: Cell, unitCell: Cell) {
        if (this.paths[markCell.x][markCell.y]) {
            let cell: Cell = markCell;
            while (!(cell.x == unitCell.x && cell.y == unitCell.y)) {
                const previousCell: Cell = this.paths[cell.x][cell.y].cell;
                let direction: Direction;
                if (cell.x == previousCell.x - 1) {
                    direction = Direction.Left;
                } else if (cell.x == previousCell.x + 1) {
                    direction = Direction.Right;
                } else if (cell.y == previousCell.y - 1) {
                    direction = Direction.Up;
                } else if (cell.y == previousCell.y + 1) {
                    direction = Direction.Down;
                }

                const pathLine = new game.Rectangle(0x00ff00, 5, 5);
                pathLine.x = cell.x * Unit.WIDTH;
                pathLine.y = cell.y * Unit.HEIGHT;
                let k = 0;
                if (direction == Direction.Left || direction == Direction.Right) {
                    pathLine.width = Unit.WIDTH;
                    pathLine.pivot.y = pathLine.height / 2;
                    k = direction == Direction.Left ? 1 : -1;
                    pathLine.x += pathLine.width / 2 * k;
                    pathLine.y += Unit.HEIGHT / 2;
                } else if (direction == Direction.Up || direction == Direction.Down) {
                    pathLine.height = Unit.HEIGHT;
                    pathLine.pivot.x = pathLine.width / 2;
                    pathLine.x += Unit.WIDTH / 2;
                    k = direction == Direction.Up ? 1 : -1;
                    pathLine.y += pathLine.height / 2 * k;
                }
                this.pathLayer.addChild(pathLine);

                cell = previousCell;
            }
        }
    }

    private addCurrentPathMarks() {
        this.removePathsAndMarksExceptCurrent();
        for (const mark of this.pathMarks) {
            this.markLayer.addChild(mark);
        }
    }
}

const enum Direction {
    Left, Right, Up, Down
}

class Mark extends game.Rectangle {

    constructor(color: number, cell: Cell = null) {
        super(color, Unit.WIDTH - Field.LINE_WIDTH, Unit.HEIGHT - Field.LINE_WIDTH);
        this.interactive = true;
        this.alpha = 0.4;
        if (cell) {
            this.cell = cell;
        }
    }

    set cell(value: Cell) {
        this.x = value.x * Unit.WIDTH + Field.LINE_WIDTH;
        this.y = value.y * Unit.HEIGHT + Field.LINE_WIDTH;
    }
}
