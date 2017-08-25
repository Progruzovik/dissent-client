import * as game from "../../game";

export default class Shell extends game.Actor {

    private to: PIXI.Point;
    private multiplier = new PIXI.Point();

    constructor(from: PIXI.Point, to: PIXI.Point) {
        super();
        this.to = to;
        this.multiplier.set(this.to.x > from.x ? 1 : -1, this.to.y > from.y ? 1 : -1);

        this.addChild(new game.Rectangle(25, 5, 0xFFFF00));
        this.rotation = Math.atan2(this.to.y - from.y, this.to.x - from.x);
        this.pivot.x = this.width / 2;
        this.pivot.y = this.height / 2;
        this.position.set(from.x, from.y);
    }

    protected update() {
        this.x += Math.sin(this.rotation + Math.PI / 2) * 30;
        this.y -= Math.cos(this.rotation + Math.PI / 2) * 30;
        if (this.x > this.to.x * this.multiplier.x && this.y > this.to.y * this.multiplier.y) {
            this.emit(game.Event.DONE);
            this.destroy();
        }
    }
}
