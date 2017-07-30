import Field from "./Field";
import * as game from "../game";

export default class Unit extends PIXI.Sprite {

    static readonly PREPARED_TO_SHOT = "preparedToFire";
    static readonly SHOT = "shot";
    static readonly NOT_PREPARED_TO_SHOT = "notPreparedToFire";
    static readonly DESTROY = "destroy";

    static readonly TEXTURE = PIXI.Texture.fromImage("/img/Ship-3-2.png", false, PIXI.SCALE_MODES.NEAREST);

    private isPreparedToShot = false;

    private remainingChargeFrames = 0;
    private charge: game.Rectangle = null;

    constructor(private readonly isLeft, private col: number, private row: number) {
        super(Unit.TEXTURE);
        this.interactive = true;
        this.setCell(col, row);
        if (!this.isLeft) {
            this.scale.x = -1;
            this.anchor.x = 1;
        }
    }

    getSpeed(): number {
        return 3;
    }

    checkLeft(): boolean {
        return this.isLeft;
    }

    checkPreparedToShot(): boolean {
        return this.isPreparedToShot;
    }

    setPreparedToShot(value: boolean) {
        this.isPreparedToShot = value;
        if (this.isPreparedToShot) {
            this.emit(Unit.PREPARED_TO_SHOT);
        } else {
            this.emit(Unit.NOT_PREPARED_TO_SHOT);
        }
    }

    getCol(): number {
        return this.col;
    }

    getRow(): number {
        return this.row;
    }

    checkReachable(col: number, row: number): boolean {
        const dCol: number = col - this.col, dRow: number = row - this.row;
        return Math.sqrt(dCol * dCol + dRow * dRow) <= this.getSpeed();
    }

    shoot(target: Unit) {
        this.setPreparedToShot(false);
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
        this.col = col;
        this.row = row;
        this.x = this.col * Field.CELL_WIDTH + Field.LINE_WIDTH;
        this.y = this.row * Field.CELL_HEIGHT + Field.LINE_WIDTH;
    }
}
