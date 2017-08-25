import * as game from "../../game";

export default class Beam extends game.Actor {

    private remainingFrames = 12;

    constructor(from: PIXI.Point, to: PIXI.Point) {
        super();
        const dx: number = to.x - from.x, dy: number = to.y - from.y;
        this.addChild(new game.Rectangle(Math.sqrt(dx * dx + dy * dy), 2, 0xFF0000));
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
