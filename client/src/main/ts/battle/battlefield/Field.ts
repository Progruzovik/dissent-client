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
    static readonly PATH_MARK_COLOR = 0x555500;

    private paths: PathNode[][];

    private readonly markCurrent = new Mark(0x005500);
    private markSelected: Mark;

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
        this.markLayer.addChild(this.markCurrent);
        this.addChild(this.markLayer);
        this.addChild(this.pathLayer);
        for (const unit of units) {
            this.addChild(unit);
        }

        unitService.on(ActionType.Move, () => this.updatePathsAndMarks());
        unitService.on(ActionType.Shot, () => this.updatePathsAndMarks());
        unitService.on(UnitService.SHOT_CELL, (cell: game.Point) => this.markLayer.addChild(new Mark(0x555555, cell)));
        unitService.on(UnitService.TARGET_CELL, (cell: game.Point) =>
            this.markLayer.addChild(new Mark(0x550000, cell)));
        unitService.on(Unit.PREPARE_TO_SHOT, () => this.removePathsAndMarksExceptCurrent());
        unitService.on(Unit.NOT_PREPARE_TO_SHOT, () => this.addCurrentPathMarks());
        unitService.on(ActionType.NextTurn, () => this.updatePathsAndMarks());
        projectileService.on(Projectile.NEW_SHOT, (projectile: Projectile) => this.addChild(projectile));
    }

    removePathsAndMarksExceptCurrent() {
        this.pathLayer.removeChildren();
        this.markLayer.removeChildren();
        this.markLayer.addChild(this.markCurrent);
    }

    private updatePathsAndMarks() {
        this.markCurrent.width = this.unitService.currentUnit.width - Field.LINE_WIDTH;
        this.markCurrent.height = this.unitService.currentUnit.height - Field.LINE_WIDTH;
        this.markCurrent.cell = this.unitService.currentUnit.cell;
        if (this.unitService.isCurrentPlayerTurn) {
            this.webSocketClient.requestPathsAndReachableCells(d => {
                this.paths = d.paths;
                this.pathMarks.length = 0;
                for (const cell of d.reachableCells) {
                    if (!this.unitService.currentUnit.isOccupyCell(cell)) {
                        const markPath = new Mark(Field.PATH_MARK_COLOR, cell);
                        this.pathMarks.push(markPath);

                        markPath.on(game.Event.MOUSE_OVER, () => this.showPath(markPath));
                        markPath.on(game.Event.CLICK, () => this.webSocketClient.moveCurrentUnit(cell));
                        markPath.on(game.Event.MOUSE_OUT, () => {
                            if (this.markSelected == markPath) {
                                markPath.color = Field.PATH_MARK_COLOR;
                                markPath.width = Field.CELL_SIZE.x - Field.LINE_WIDTH;
                                markPath.height = Field.CELL_SIZE.y - Field.LINE_WIDTH;
                                this.markSelected = null;
                                this.pathLayer.removeChildren();
                            }
                        });
                    }
                }
                this.addCurrentPathMarks();
            });
        }
    }

    private showPath(mark: Mark) {
        if (this.paths[mark.cell.x][mark.cell.y]) {
            if (this.markSelected != null) {
                this.markSelected.color = Field.PATH_MARK_COLOR;
                this.markSelected.width = Field.CELL_SIZE.x - Field.LINE_WIDTH;
                this.markSelected.height = Field.CELL_SIZE.y - Field.LINE_WIDTH;
            }
            this.markSelected = mark;
            this.markSelected.color = 0x005500;
            this.markSelected.width = this.unitService.currentUnit.width - Field.LINE_WIDTH;
            this.markSelected.height = this.unitService.currentUnit.height - Field.LINE_WIDTH;
            this.pathLayer.removeChildren();
            this.markLayer.setChildIndex(this.markSelected, this.markLayer.children.length - 1);

            const pathOffsetX: number = (this.unitService.currentUnit.ship.hull.width - 1) / 2;
            const pathOffsetY: number = (this.unitService.currentUnit.ship.hull.height - 1) / 2;
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

                const pathLine = new game.Line(0, 4, 0x00aa00);
                pathLine.x = (cell.x + pathOffsetX + game.CENTER) * Field.CELL_SIZE.x;
                pathLine.y = (cell.y + pathOffsetY + game.CENTER) * Field.CELL_SIZE.y;
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
            txtMoveCost.position.set(this.markSelected.x, this.markSelected.y);
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
