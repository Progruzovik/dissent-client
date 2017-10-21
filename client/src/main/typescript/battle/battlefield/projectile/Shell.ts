import Projectile from "./Projectile";
import { ActionType, Cell } from "../../util";
import * as game from "../../../game";

export default class Shell extends Projectile {

    private static readonly SHOT_DELAY = 15;

    private isNextShotReady = false;
    private frameNumber = 0;
    private readonly multiplier: Cell;

    constructor(private readonly target: Cell, from: Cell) {
        super(3);
        this.multiplier = new Cell(this.target.x < from.x ? -1 : 1, this.target.y < from.y ? -1 : 1);

        this.addChild(new game.Rectangle(0xFFFF00, 20, 4));
        this.rotation = Math.atan2(this.target.y - from.y, this.target.x - from.x);
        this.pivot.x = this.width / 2;
        this.pivot.y = this.height / 2;
        this.position.set(from.x, from.y);
    }

    protected update() {
        if (!this.isNextShotReady) {
            this.frameNumber++;
            if (this.frameNumber == Shell.SHOT_DELAY) {
                this.emitNextShot();
            }
        }
        this.x += Math.sin(this.rotation + Math.PI / 2) * 35;
        this.y -= Math.cos(this.rotation + Math.PI / 2) * 35;
        if ((this.target.x - this.x) * this.multiplier.x <= 0 && (this.target.y - this.y) * this.multiplier.y <= 0) {
            if (!this.isNextShotReady) {
                this.emitNextShot();
            }
            this.emit(game.Event.DONE);
            this.destroy();
        }
    }

    private emitNextShot() {
        this.isNextShotReady = true;
        this.emit(ActionType.Shot);
    }
}
