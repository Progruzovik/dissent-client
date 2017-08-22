import { AbstractGun } from "./AbstractGun";
import * as game from "../../game";

export default class Beam extends AbstractGun {

    private remainingChargeFrames = 0;
    private charge: game.Rectangle;

    constructor() {
        super(15);
    }

    shoot(fromX: number, fromY: number, toX: number, toY: number, container: PIXI.Container) {
        const dx: number = toX - fromX, dy: number = toY - fromY;
        this.charge = new game.Rectangle(Math.sqrt(dx * dx + dy * dy), 2, 0xFF0000);
        this.charge.rotation = Math.atan2(dy, dx);
        this.charge.pivot.y = this.charge.height / 2;
        this.charge.x = fromX;
        this.charge.y = fromY;
        container.addChild(this.charge);

        this.remainingChargeFrames = 12;
        PIXI.ticker.shared.add(this.update, this);
    }

    protected update() {
        if (this.remainingChargeFrames > 0) {
            this.remainingChargeFrames--;
        } else {
            PIXI.ticker.shared.remove(this.update, this);
            this.charge.destroy();
            this.emit(game.Event.DONE);
        }
    }
}
