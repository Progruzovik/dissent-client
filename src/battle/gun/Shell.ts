import * as game from "../../game";
import Unit from "../unit/Unit";

export default class Shell extends game.Actor {

    private multiplier = new PIXI.Point();
    private frameNumber = 0;

    constructor(private readonly delay: number, private readonly to: PIXI.Point, from: PIXI.Point) {
        super();
        this.multiplier.set(this.to.x > from.x ? 1 : -1, this.to.y > from.y ? 1 : -1);

        this.addChild(new game.Rectangle(20, 4, 0xFFFF00));
        this.rotation = Math.atan2(this.to.y - from.y, this.to.x - from.x);
        this.pivot.x = this.width / 2;
        this.pivot.y = this.height / 2;
        this.position.set(from.x, from.y);
    }

    protected update() {
        if (this.frameNumber < this.delay) {
            this.frameNumber++;
            if (this.frameNumber == this.delay) {
                this.emit(Unit.SHOT);
            }
        }
        this.x += Math.sin(this.rotation + Math.PI / 2) * 35;
        this.y -= Math.cos(this.rotation + Math.PI / 2) * 35;
        if (this.x > this.to.x * this.multiplier.x && this.y > this.to.y * this.multiplier.y) {
            this.emit(game.Event.DONE);
            this.destroy();
        }
    }
}