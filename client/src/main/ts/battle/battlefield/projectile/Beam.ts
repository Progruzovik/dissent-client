import Projectile from "./Projectile";
import * as game from "../../../game";

export default class Beam extends Projectile {

    constructor(from: game.Point, to: game.Point) {
        super(1, 12);
        const line = new game.Line(0, 2, 0xff0000);
        line.direct(to, from);
        this.addChild(line);
        this.position.set(from.x, from.y);
    }

    protected update(deltaTime: number) {
        super.update(deltaTime);
        if (this.isTimeOver) {
            this.emit(game.Event.DONE);
            this.destroy({ children: true });
        }
    }
}
