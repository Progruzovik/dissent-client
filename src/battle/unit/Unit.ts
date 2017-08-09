import Field from "../field/Field";
import Ship from "./Ship";
import * as game from "../../game";

export default class Unit extends PIXI.Sprite {

    static readonly WIDTH = 64;
    static readonly HEIGHT = 32;

    static readonly MOVE = "move";
    static readonly PREPARED_TO_SHOT = "preparedToShot";
    static readonly SHOT = "shot";
    static readonly NOT_PREPARED_TO_SHOT = "notPreparedToShot";
    static readonly DESTROY = "destroy";

    private _isPreparedToShot = false;
    private _movementPoints = 0;

    private remainingChargeFrames = 0;
    private charge: game.Rectangle = null;
    private _path: game.Direction[] = null;
    private oldPosition: PIXI.Point = null;

    constructor(readonly isLeft, private _col: number, private _row: number, readonly ship: Ship) {
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
                    this.emit(Unit.MOVE, this.oldPosition, new PIXI.Point(this.col, this.row));
                    this.emit(game.Event.READY);
                }
            }
        });
    }

    get isPreparedToShot(): boolean {
        return this._isPreparedToShot;
    }

    set isPreparedToShot(value: boolean) {
        this._isPreparedToShot = value;
        this.emit(this.isPreparedToShot ? Unit.PREPARED_TO_SHOT : Unit.NOT_PREPARED_TO_SHOT);
    }

    get movementPoints(): number {
        return this._movementPoints;
    }

    get path(): game.Direction[] {
        return this._path;
    }

    set path(value: game.Direction[]) {
        this._path = value;
        if (value) {
            this.oldPosition = new PIXI.Point(this.col, this.row);
        }
    }

    get col(): number {
        return this._col;
    }

    get row(): number {
        return this._row;
    }

    calculateDistanceToCell(cell: PIXI.Point): number {
        const dCol: number = cell.x - this.col, dRow: number = cell.y - this.row;
        return Math.sqrt(dCol * dCol + dRow * dRow);
    }

    makeCurrent() {
        this._movementPoints = this.ship.speed;
    }

    shoot(target: Unit) {
        this.isPreparedToShot = false;
        this.remainingChargeFrames = 8;
        const dx: number = target.x - this.x;
        const dy: number = target.y - this.y;
        this.charge = new game.Rectangle(Math.sqrt(dx * dx + dy * dy), 2, 0xFF0000);
        this.charge.rotation = Math.atan2(dy, dx);
        this.charge.pivot.y = this.charge.height / 2;
        this.charge.x = this.x + this.width / 2;
        this.charge.y = this.y + this.height / 2;
        this.parent.addChild(this.charge);

        this.charge.on(game.Event.UPDATE, () => {
            if (this.remainingChargeFrames > 0) {
                this.remainingChargeFrames--;
            } else {
                this.charge.parent.removeChild(this.charge);
                target.destroy();
                this.emit(game.Event.READY);
            }
        });
        this.emit(Unit.SHOT);
    }

    destroy() {
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
