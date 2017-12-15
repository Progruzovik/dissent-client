import Projectile from "./Projectile";
import * as game from "../../../game";

export default class Shell extends Projectile {

    private static readonly SPEED = 33;

    private isNextShotReady = false;
    private frameNumber = 0;
    private readonly multiplier: game.Point;

    constructor(private readonly shotDelay: number, shotsCount: number,
                width: number, height: number, from: game.Point, private readonly target: game.Point) {
        super(shotsCount);
        this.multiplier = new game.Point(this.target.x < from.x ? -1 : 1, this.target.y < from.y ? -1 : 1);

        this.addChild(new game.Rectangle(width, height, 0xffff00));
        this.rotation = Math.atan2(this.target.y - from.y, this.target.x - from.x);
        this.pivot.x = this.width / 2;
        this.pivot.y = this.height / 2;
        this.position.set(from.x, from.y);
    }

    protected update() {
        if (!this.isNextShotReady) {
            this.frameNumber++;
            if (this.frameNumber == this.shotDelay) {
                this.emitNextShot();
            }
        }
        this.x += Math.sin(this.rotation + Math.PI / 2) * Shell.SPEED;
        this.y -= Math.cos(this.rotation + Math.PI / 2) * Shell.SPEED;
        if ((this.target.x - this.x) * this.multiplier.x <= 0 && (this.target.y - this.y) * this.multiplier.y <= 0) {
            if (!this.isNextShotReady) {
                this.emitNextShot();
            }
            this.emit(game.Event.DONE);
            this.destroy();
        }
    }

    private emitNextShot() {
        this.isNextShotReady = true;
        this.emit(Projectile.NEW_SHOT);
    }
}
