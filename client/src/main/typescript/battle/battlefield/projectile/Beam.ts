import Projectile from "./Projectile";
import { Cell } from "../../util";
import * as game from "../../../game";

export default class Beam extends Projectile {

    private remainingFrames = 12;

    constructor(to: Cell, from: Cell) {
        super(1);
        const dx: number = to.x - from.x, dy: number = to.y - from.y;
        this.addChild(new game.Rectangle(Math.sqrt(dx * dx + dy * dy), 2, 0xff0000));
        this.rotation = Math.atan2(dy, dx);
        this.pivot.y = this.height / 2;
        this.position.set(from.x, from.y);
    }

    protected update() {
        if (this.remainingFrames > 0) {
            this.remainingFrames--;
        } else {
            this.emit(game.Event.DONE);
            this.destroy();
        }
    }
}
