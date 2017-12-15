import Projectile from "./Projectile";
import * as game from "../../../game";

export default class Beam extends Projectile {

    private remainingFrames = 12;

    constructor(from: game.Point, to: game.Point) {
        super(1);
        const line = new game.Line(0, 2, 0xff0000);
        line.direct(to, from);
        this.addChild(line);
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
