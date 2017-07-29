import Field from "./Field";
import * as game from "../Game";

export default class Unit extends PIXI.Sprite {

    private static readonly TEXTURE = PIXI.Texture.fromImage("/img/Ship-3-2.png", false, PIXI.SCALE_MODES.NEAREST);

    private isPreparedToFire = false;

    private remainingChargeFrames = 0;
    private charge: game.Rectangle = null;

    constructor(readonly isLeft: boolean, private col: number, private row: number) {
        super(Unit.TEXTURE);
        this.interactive = true;
        
        if (!this.isLeft) {
            this.scale.x = -1;
            this.anchor.x = 1;
        }
        this.updatePosition();
    }

    checkPreparedToFire(): boolean {
        return this.isPreparedToFire;
    }

    setPreparedToFire(value: boolean) {
        this.isPreparedToFire = value;
    }

    getCol(): number {
        return this.col;
    }

    getNextCol(): number {
        return this.isLeft ? this.col + 1 : this.col - 1;
    }

    getRow(): number {
        return this.row;
    }

    fire(target: Unit) {
        this.isPreparedToFire = false;
        this.remainingChargeFrames = 8;
        const dx: number = target.x - this.x;
        const dy: number = target.y - this.y;
        this.charge = new game.Rectangle(Math.sqrt(dx * dx + dy * dy), 2, 0xFF0000);
        this.charge.rotation = Math.atan2(dy, dx);
        this.charge.pivot.y = this.charge.height / 2;
        this.charge.x = this.x;
        this.charge.y = this.y;
        this.parent.addChild(this.charge);

        this.charge.on(game.Event.UPDATE, () => {
            if (this.remainingChargeFrames > 0) {
                this.remainingChargeFrames--;
            } else {
                this.charge.parent.removeChild(this.charge);
                target.destroy();
                this.emit(game.Event.TASK_DONE);
            }
        });
    }

    changeRow(isUpper: boolean) {
        this.row = isUpper ? this.row - 1 : this.row + 1;
        this.updatePosition();
        this.emit(game.Event.TASK_DONE);
    }

    idle() {
        this.emit(game.Event.TASK_DONE);
    }

    move() {
        this.col = this.getNextCol();
        this.updatePosition();
        this.emit(game.Event.FINISH);
    }

    destroy() {
        this.alpha = 0.5;
        this.emit(game.Event.DESTROY);
    }

    private updatePosition() {
        this.x = this.col * Field.CELL_WIDTH + Field.LINE_WIDTH;
        this.y = this.row * Field.CELL_HEIGHT + Field.LINE_WIDTH;
    }
}
