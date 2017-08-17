import { AbstractGun } from "./AbstractGun";
import * as game from "../../game";

export default class Beam extends AbstractGun {

    constructor() {
        super(15);
    }

    shoot(fromX: number, fromY: number, toX: number, toY: number, container: PIXI.Container) {
        const dx: number = toX - fromX, dy: number = toY - fromY;
        const charge = new game.Rectangle(Math.sqrt(dx * dx + dy * dy), 2, 0xFF0000);
        charge.rotation = Math.atan2(dy, dx);
        charge.pivot.y = charge.height / 2;
        charge.x = fromX;
        charge.y = fromY;
        container.addChild(charge);

        let remainingChargeFrames = 12;
        charge.on(game.Event.UPDATE, () => {
            if (remainingChargeFrames > 0) {
                remainingChargeFrames--;
            } else {
                container.removeChild(charge);
                this.emit(game.Event.DONE);
            }
        });
    }
}
