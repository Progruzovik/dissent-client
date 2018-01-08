import Projectile from "./projectile/Projectile";
import ProjectileService from "./projectile/ProjectileService";
import Unit from "./unit/Unit";
import UnitService from "./unit/UnitService";
import WebSocketClient from "../WebSocketClient";
import { ActionType, PathNode } from "../util";
import { l } from "../../localizer";
import * as game from "../../game";

export default class Field extends game.UiLayer {

    static readonly CELL_SIZE = new game.Point(64, 48);
    static readonly LINE_WIDTH = 1.5;
    static readonly PATH_MARK_COLOR = 0xffff00;

    private paths: PathNode[][];

    private selectedMark: Mark;

    private readonly currentMark = new Mark(0x00ff00);
    private readonly pathMarks = new Array<Mark>(0);
    private readonly pathLayer = new PIXI.Container();
    private readonly markLayer = new PIXI.Container();

    constructor(private readonly size: game.Point, units: Unit[], asteroids: game.Point[], clouds: game.Point[],
                private readonly unitService: UnitService, private readonly projectileService: ProjectileService,
                private readonly webSocketClient: WebSocketClient) {
        super();

        const bg = new game.Rectangle(0, 0);
        this.addChild(bg);
        for (let i = 0; i <= size.y; i++) {
            const line = new game.Line(size.x * Field.CELL_SIZE.x + Field.LINE_WIDTH, Field.LINE_WIDTH, 0x777777);
            line.y = i * Field.CELL_SIZE.y;
            this.addChild(line);
        }
        for (let i = 0; i <= size.y; i++) {
            const line = new game.Line(size.y * Field.CELL_SIZE.y + Field.LINE_WIDTH, Field.LINE_WIDTH, 0x777777);
            line.pivot.y = line.thickness;
            line.rotation = Math.PI / 2;
            line.x = i * Field.CELL_SIZE.x;
            this.addChild(line);
        }
        bg.width = this.width;
        bg.height = this.height;

        for (const asteroid of asteroids) {
            const spriteAsteroid = new PIXI.Sprite(PIXI.loader.resources["asteroid"].texture);
            spriteAsteroid.x = asteroid.x * Field.CELL_SIZE.x;
            spriteAsteroid.y = asteroid.y * Field.CELL_SIZE.y;
            this.addChild(spriteAsteroid);
        }
        for (const cloud of clouds) {
            const spriteCloud = new PIXI.Sprite(PIXI.loader.resources["cloud"].texture);
            spriteCloud.x = cloud.x * Field.CELL_SIZE.x;
            spriteCloud.y = cloud.y * Field.CELL_SIZE.y;
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
        unitService.on(UnitService.SHOT_CELL, (cell: game.Point) => this.markLayer.addChild(new Mark(0xffffff, cell)));
        unitService.on(UnitService.TARGET_CELL, (cell: game.Point) =>
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
            this.webSocketClient.requestPathsAndReachableCells(d => {
                this.paths = d.paths;
                this.pathMarks.length = 0;
                for (const cell of d.reachableCells) {
                    const pathMark = new Mark(Field.PATH_MARK_COLOR, cell);
                    this.pathMarks.push(pathMark);

                    pathMark.on(game.Event.MOUSE_OVER, () => this.showPath(pathMark));
                    pathMark.on(game.Event.CLICK, () => this.webSocketClient.moveCurrentUnit(cell));
                    pathMark.on(game.Event.MOUSE_OUT, () => {
                        if (this.selectedMark == pathMark) {
                            pathMark.color = Field.PATH_MARK_COLOR;
                            this.selectedMark = null;
                            this.pathLayer.removeChildren();
                        }
                    });
                }
                this.addCurrentPathMarks();
            });
        }
    }

    private showPath(mark: Mark) {
        if (this.paths[mark.cell.x][mark.cell.y]) {
            if (this.selectedMark != null) {
                this.selectedMark.color = Field.PATH_MARK_COLOR;
            }
            mark.color = 0x00ff00;
            this.selectedMark = mark;
            this.pathLayer.removeChildren();

            let cell: game.Point = mark.cell;
            while (!(cell.x == this.unitService.currentUnit.cell.x && cell.y == this.unitService.currentUnit.cell.y)) {
                const previousCell: game.Point = this.paths[cell.x][cell.y].cell;
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

                const pathLine = new game.Line(0, 4, 0x00ff00);
                pathLine.alpha = 0.5;
                pathLine.x = (cell.x + game.CENTER) * Field.CELL_SIZE.x;
                pathLine.y = (cell.y + game.CENTER) * Field.CELL_SIZE.y;
                const k = direction == Direction.Left || direction == Direction.Up ? 1 : -1;
                const destination = new PIXI.Point(pathLine.x, pathLine.y);
                if (direction == Direction.Left || direction == Direction.Right) {
                    pathLine.width = Field.CELL_SIZE.x;
                    destination.x += pathLine.width * k;
                } else if (direction == Direction.Up || direction == Direction.Down) {
                    pathLine.width = Field.CELL_SIZE.y;
                    destination.y += pathLine.width * k;
                }
                pathLine.direct(destination);
                this.pathLayer.addChild(pathLine);
                cell = previousCell;
            }
            const moveCost = `${this.paths[mark.cell.x][mark.cell.y].movementCost.toLocaleString()} ${l("ap")}`;
            const txtMoveCost = new PIXI.Text(moveCost, { fill: "white", fontSize: 12 });
            txtMoveCost.position.set(this.selectedMark.x, this.selectedMark.y);
            this.pathLayer.addChild(txtMoveCost);
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

    private _cell: game.Point;

    constructor(color: number, cell?: game.Point) {
        super(Field.CELL_SIZE.x - Field.LINE_WIDTH, Field.CELL_SIZE.y - Field.LINE_WIDTH, color);
        this.interactive = true;
        this.alpha = 0.35;
        if (cell) {
            this.cell = cell;
        }
    }

    get cell(): game.Point {
        return this._cell;
    }

    set cell(value: game.Point) {
        this._cell = value;
        this.x = value.x * Field.CELL_SIZE.x + Field.LINE_WIDTH;
        this.y = value.y * Field.CELL_SIZE.y + Field.LINE_WIDTH;
    }
}
