import { AbstractProjectile } from "./AbstractProjectile";
import * as druid from "pixi-druid";

export class Beam extends AbstractProjectile {

    constructor(from: druid.Point, to: druid.Point) {
        super(1, 12);
        const line = new druid.Line(2, 0xff0000);
        line.position.set(from.x, from.y);
        line.directTo(to.x, to.y);
        this.addChild(line);
    }

    protected update(deltaTime: number) {
        super.update(deltaTime);
        if (this.isTimeOver) {
            this.emit(druid.Event.DONE);
            this.destroy({ children: true });
        }
    }
}
