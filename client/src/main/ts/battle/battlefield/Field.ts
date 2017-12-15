import Projectile from "./projectile/Projectile";
import ProjectileService from "./projectile/ProjectileService";
import Unit from "./unit/Unit";
import UnitService from "./unit/UnitService";
import WebSocketConnection from "../WebSocketConnection";
import {ActionType, Cell, PathNode, Side} from "../util";
import * as game from "../../game";

export default class Field extends game.UiLayer {

    static readonly LINE_WIDTH = 1.5;

    private paths: PathNode[][];

    private selectedCell: Cell;

    private readonly currentMark = new Mark(0x00ff00);
    private readonly pathMarks = new Array<Mark>(0);
    private readonly pathLayer = new PIXI.Container();
    private readonly markLayer = new PIXI.Container();

    constructor(private readonly size: Cell, units: Unit[], asteroids: Cell[], clouds: Cell[],
                private readonly unitService: UnitService, private readonly projectileService: ProjectileService,
                private readonly webSocketConnection: WebSocketConnection) {
        super();

        const bg = new game.Rectangle(0, 0);
        this.addChild(bg);
        for (let i = 0; i <= size.y; i++) {
            const line = new game.Rectangle(size.x * Unit.WIDTH + Field.LINE_WIDTH,
                Field.LINE_WIDTH, 0x777777);
            line.y = i * Unit.HEIGHT;
            this.addChild(line);
        }
        for (let i = 0; i <= size.y; i++) {
            const line = new game.Rectangle(Field.LINE_WIDTH,
                size.y * Unit.HEIGHT + Field.LINE_WIDTH, 0x777777);
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
        for (const unit of units) {
            this.addChild(unit);
        }

        unitService.on(ActionType.Move, () => this.updatePathsAndMarks());
        unitService.on(ActionType.Shot, () => this.updatePathsAndMarks());
        unitService.on(UnitService.SHOT_CELL, (cell: Cell) =>
            this.markLayer.addChild(new Mark(0xffffff, cell)));
        unitService.on(UnitService.TARGET_CELL, (cell: Cell) =>
            this.markLayer.addChild(new Mark(0xff0000, cell)));
        unitService.on(Unit.PREPARE_TO_SHOT, () => this.removePathsAndMarksExceptCurrent());
        unitService.on(Unit.NOT_PREPARE_TO_SHOT, () => this.addCurrentPathMarks());
        unitService.on(ActionType.NextTurn, () => this.updatePathsAndMarks());
        projectileService.on(Projectile.NEW_SHOT, (projectile: Projectile) => this.addChild(projectile));
    }

    removePathsAndMarksExceptCurrent() {
        this.pathLayer.removeChildren();
        this.markLayer.removeChildren();
        this.markLayer.addChild(this.currentMark);
    }

    private updatePathsAndMarks() {
        this.currentMark.cell = this.unitService.currentUnit.cell;
        if (this.unitService.isCurrentPlayerTurn) {
            this.webSocketConnection.requestPathsAndReachableCells(d => {
                this.paths = d.paths;
                this.pathMarks.length = 0;
                for (const cell of d.reachableCells) {
                    const pathMark = new Mark(0xffff00, cell);
                    this.pathMarks.push(pathMark);

                    pathMark.on(game.Event.MOUSE_OVER, () =>
                        this.showPath(cell, this.unitService.currentUnit.cell));
                    pathMark.on(game.Event.CLICK, () => this.webSocketConnection.moveCurrentUnit(cell));
                    pathMark.on(game.Event.MOUSE_OUT, () => {
                        if (this.selectedCell == cell) {
                            this.selectedCell = null;
                            this.pathLayer.removeChildren();
                        }
                    });
                }
                this.addCurrentPathMarks();
            });
        }
    }

    private showPath(markCell: Cell, unitCell: Cell) {
        if (this.paths[markCell.x][markCell.y]) {
            this.selectedCell = markCell;
            this.pathLayer.removeChildren();
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

                const rectLine = new game.Rectangle(5, 5, 0x00ff00);
                rectLine.position.set(cell.x * Unit.WIDTH, cell.y * Unit.HEIGHT);
                let k = 0;
                if (direction == Direction.Left || direction == Direction.Right) {
                    rectLine.width = Unit.WIDTH;
                    rectLine.pivot.y = rectLine.height / 2;
                    k = direction == Direction.Left ? 1 : -1;
                    rectLine.x += rectLine.width / 2 * k;
                    rectLine.y += Unit.HEIGHT / 2;
                } else if (direction == Direction.Up || direction == Direction.Down) {
                    rectLine.height = Unit.HEIGHT;
                    rectLine.pivot.x = rectLine.width / 2;
                    rectLine.x += Unit.WIDTH / 2;
                    k = direction == Direction.Up ? 1 : -1;
                    rectLine.y += rectLine.height / 2 * k;
                }
                this.pathLayer.addChild(rectLine);
                cell = previousCell;
            }
            const rectEnd = new game.Rectangle(14, 14, 0x00ff00);
            rectEnd.pivot.set(rectEnd.width / 2, rectEnd.height / 2);
            rectEnd.position.set((markCell.x + game.CENTER) * Unit.WIDTH, (markCell.y + game.CENTER) * Unit.HEIGHT);
            this.pathLayer.addChild(rectEnd);
            const txtCost = new PIXI.Text(this.paths[markCell.x][markCell.y].movementCost.toLocaleString(),
                { fill: 0xffffff, fontSize: 12 });
            txtCost.position.set(rectEnd.x + game.INDENT / 2, rectEnd.y - game.INDENT);
            this.pathLayer.addChild(txtCost);
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

    constructor(color: number, cell?: Cell) {
        super(Unit.WIDTH - Field.LINE_WIDTH, Unit.HEIGHT - Field.LINE_WIDTH, color);
        this.interactive = true;
        this.alpha = 0.35;
        if (cell) {
            this.cell = cell;
        }
    }

    set cell(value: Cell) {
        this.x = value.x * Unit.WIDTH + Field.LINE_WIDTH;
        this.y = value.y * Unit.HEIGHT + Field.LINE_WIDTH;
    }
}
