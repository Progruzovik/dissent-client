import { Cell } from "../request";
import { SHOT } from "../util";
import * as game from "../../game";

export default class Shell extends game.Actor {

    private isNextShotReady = false;
    private frameNumber = 0;
    private multiplier: Cell;

    constructor(private readonly delay: number, private readonly to: Cell, from: Cell) {
        super();
        this.multiplier = new Cell(this.to.x > from.x ? 1 : -1, this.to.y > from.y ? 1 : -1);

        this.addChild(new game.Rectangle(0xFFFF00, 20, 4));
        this.rotation = Math.atan2(this.to.y - from.y, this.to.x - from.x);
        this.pivot.x = this.width / 2;
        this.pivot.y = this.height / 2;
        this.position.set(from.x, from.y);
    }

    protected update() {
        if (!this.isNextShotReady) {
            this.frameNumber++;
            if (this.frameNumber == this.delay) {
                this.emitNextShot();
            }
        }
        this.x += Math.sin(this.rotation + Math.PI / 2) * 35;
        this.y -= Math.cos(this.rotation + Math.PI / 2) * 35;
        if (this.x > this.to.x * this.multiplier.x && this.y > this.to.y * this.multiplier.y) {
            if (!this.isNextShotReady) {
                this.emitNextShot();
            }
            this.emit(game.Event.DONE);
            this.destroy();
        }
    }

    private emitNextShot() {
        this.isNextShotReady = true;
        this.emit(SHOT);
    }
}
