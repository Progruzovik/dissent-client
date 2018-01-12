import Projectile from "./Projectile";
import * as druid from "pixi-druid";

export default class Beam extends Projectile {

    constructor(from: druid.Point, to: druid.Point) {
        super(1, 12);
        const line = new druid.Line(0, 2, 0xff0000);
        line.direct(to, from);
        this.addChild(line);
        this.position.set(from.x, from.y);
    }

    protected update(deltaTime: number) {
        super.update(deltaTime);
        if (this.isTimeOver) {
            this.emit(druid.Event.DONE);
            this.destroy({ children: true });
        }
    }
}
