import Field from "./Field";
import * as game from "../game";

export default class Unit extends PIXI.Sprite {

    static readonly WIDTH = 64;
    static readonly HEIGHT = 32;

    static readonly PREPARED_TO_SHOT = "preparedToFire";
    static readonly SHOT = "shot";
    static readonly NOT_PREPARED_TO_SHOT = "notPreparedToFire";
    static readonly DESTROY = "destroy";

    private _isPreparedToShot = false;
    get isPreparedToShot(): boolean {
        return this._isPreparedToShot;
    }
    set isPreparedToShot(value: boolean) {
        this._isPreparedToShot = value;
        this.emit(this.isPreparedToShot ? Unit.PREPARED_TO_SHOT : Unit.NOT_PREPARED_TO_SHOT);
    }

    private remainingChargeFrames = 0;
    private charge: game.Rectangle = null;

    constructor(readonly isLeft, private _col: number, private _row: number) {
        super(PIXI.loader.resources["Ship-3-2"].texture);
        this.interactive = true;
        this.setCell(this.col, this.row);
        if (!this.isLeft) {
            this.scale.x = -1;
            this.anchor.x = 1;
        }
    }

    get speed(): number {
        return 3;
    }

    get col(): number {
        return this._col;
    }

    get row(): number {
        return this._row;
    }

    checkReachable(col: number, row: number): boolean {
        const dCol: number = col - this.col, dRow: number = row - this.row;
        return Math.sqrt(dCol * dCol + dRow * dRow) <= this.speed;
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
        this.setCell(col, row);
        this.emit(game.Event.READY);
    }

    destroy() {
        this.alpha = 0.5;
        this.emit(Unit.DESTROY);
    }

    private setCell(col: number, row: number) {
        this._col = col;
        this._row = row;
        this.x = this.col * Unit.WIDTH + Field.LINE_WIDTH;
        this.y = this.row * Unit.HEIGHT + Field.LINE_WIDTH;
    }
}
