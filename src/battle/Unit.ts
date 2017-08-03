import Field from "./Battlefield/Field";
import Ship from "./Ship";
import * as game from "../game";

export default class Unit extends PIXI.Sprite {

    static readonly WIDTH = 64;
    static readonly HEIGHT = 32;

    static readonly PREPARED_TO_SHOT = "preparedToShot";
    static readonly SHOT = "shot";
    static readonly NOT_PREPARED_TO_SHOT = "notPreparedToShot";
    static readonly DESTROY = "destroy";

    private _isPreparedToShot = false;
    private _movementPoints: number;

    private remainingChargeFrames = 0;
    private charge: game.Rectangle = null;

    constructor(readonly isLeft, private _col: number, private _row: number, readonly ship: Ship) {
        super(PIXI.loader.resources["Ship-3-2"].texture);
        this.interactive = true;
        this.setCell(this.col, this.row);
        if (!this.isLeft) {
            this.scale.x = -1;
            this.anchor.x = 1;
        }
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

    get col(): number {
        return this._col;
    }

    get row(): number {
        return this._row;
    }

    checkReachable(col: number, row: number): boolean {
        return this.calculateDistance(col, row) <= this.movementPoints;
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

    moveTo(col: number, row: number) {
        this._movementPoints -= this.calculateDistance(col, row);
        this.setCell(col, row);
        this.emit(game.Event.READY);
    }

    destroy() {
        this.alpha = 0.5;
        this.emit(Unit.DESTROY);
    }

    private calculateDistance(col: number, row: number): number {
        const dCol: number = col - this.col, dRow: number = row - this.row;
        return Math.sqrt(dCol * dCol + dRow * dRow);
    }

    private setCell(col: number, row: number) {
        this._col = col;
        this._row = row;
        this.x = this.col * Unit.WIDTH + Field.LINE_WIDTH / 2;
        this.y = this.row * Unit.HEIGHT + Field.LINE_WIDTH / 2;
    }
}
