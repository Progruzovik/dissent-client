import Field from "../field/Field";
import Ship from "./Ship";
import { AbstractGun } from "../gun/AbstractGun";
import * as game from "../../game";

export default class Unit extends PIXI.Sprite {

    static readonly WIDTH = 64;
    static readonly HEIGHT = 32;

    static readonly MOVE = "move";
    static readonly PREPARED_TO_SHOT = "preparedToShot";
    static readonly SHOT = "shot";
    static readonly NOT_PREPARED_TO_SHOT = "notPreparedToShot";
    static readonly DESTROY = "destroy";

    private _movementPoints = 0;
    private _isDestroyed = false;

    private _path: game.Direction[] = null;
    private oldCell: PIXI.Point = null;

    private _preparedGun: AbstractGun = null;
    private activeGun: AbstractGun = null;

    constructor(readonly isLeft: boolean, private _col: number, private _row: number,
                readonly ship: Ship, readonly firstGun: AbstractGun, readonly secondGun: AbstractGun) {
        super(PIXI.loader.resources["Ship-3-2"].texture);
        this.interactive = true;
        this.setCell(this.col, this.row);
        if (!this.isLeft) {
            this.scale.x = -1;
            this.anchor.x = 1;
        }

        this.on(game.Event.UPDATE, () => {
            if (this.path) {
                if (this.path.length > 0 && this.movementPoints > 0) {
                    this._movementPoints--;
                    const direction: game.Direction = this.path.pop();
                    if (direction == game.Direction.Left) {
                        this.setCell(this.col - 1, this.row);
                    } else if (direction == game.Direction.Right) {
                        this.setCell(this.col + 1, this.row);
                    } else if (direction == game.Direction.Down) {
                        this.setCell(this.col, this.row - 1);
                    } else if (direction == game.Direction.Up) {
                        this.setCell(this.col, this.row + 1);
                    }
                } else {
                    this.path = null;
                    this.emit(Unit.MOVE, this.oldCell, this.cell);
                    this.emit(game.Event.DONE);
                }
            }
            if (this.activeGun) {
                this.activeGun.emit(game.Event.UPDATE);
            }
        });
    }

    get movementPoints(): number {
        return this._movementPoints;
    }

    get isDestroyed(): boolean {
        return this._isDestroyed;
    }

    get path(): game.Direction[] {
        return this._path;
    }

    set path(value: game.Direction[]) {
        this._path = value;
        if (value) {
            this.oldCell = this.cell;
        }
    }

    get col(): number {
        return this._col;
    }

    get row(): number {
        return this._row;
    }

    get cell(): PIXI.Point {
        return new PIXI.Point(this.col, this.row);
    }

    get preparedGun(): AbstractGun {
        return this._preparedGun;
    }

    set preparedGun(value: AbstractGun) {
        this._preparedGun = value;
        if (value) {
            this.emit(Unit.PREPARED_TO_SHOT);
        } else {
            this.emit(Unit.NOT_PREPARED_TO_SHOT);
        }
    }

    canHit(target: Unit) {
        return this.preparedGun && this.isLeft != target.isLeft && !target.isDestroyed
            && this.calculateDistanceToCell(target.cell) <= this.preparedGun.radius;
    }

    calculateDistanceToCell(cell: PIXI.Point): number {
        return Math.abs(cell.x - this.col) + Math.abs(cell.y - this.row);
    }

    makeCurrent() {
        this._movementPoints = this.ship.speed;
    }

    shoot(target: Unit) {
        this.preparedGun.shoot(this.x + this.width / 2, this.y + this.height / 2,
            target.x + target.width / 2, target.y + target.height / 2, this.parent);
        this.emit(Unit.SHOT);
        this.activeGun = this.preparedGun;
        this.preparedGun = null;

        this.activeGun.on(game.Event.DONE, () => {
            target.destroyShip();
        });
    }

    destroyShip() {
        this._isDestroyed = true;
        this.alpha = 0.5;
        this.emit(Unit.DESTROY);
    }

    private setCell(col: number, row: number) {
        this._col = col;
        this._row = row;
        this.x = this.col * Unit.WIDTH + Field.LINE_WIDTH / 2;
        this.y = this.row * Unit.HEIGHT + Field.LINE_WIDTH / 2;
    }
}
