import { AbstractProjectile } from "./AbstractProjectile";
import * as druid from "pixi-druid";

export class Shell extends AbstractProjectile {

    private static readonly SPEED = 33;

    private isNextShotReady = false;
    private passedTime = 0;

    constructor(private readonly shotDelay: number, shotsCount: number,
                width: number, height: number, from: druid.Point, private readonly target: druid.Point) {
        super(shotsCount);
        const dx: number = target.x - from.x, dy: number = target.y - from.y;
        this.resetTimer(Math.sqrt(dx * dx + dy * dy) / Shell.SPEED);

        this.addChild(new druid.Rectangle(width, height, 0xffff00));
        this.rotation = Math.atan2(dy, dx);
        this.pivot.x = this.width / 2;
        this.pivot.y = this.height / 2;
        this.position.set(from.x, from.y);
    }

    protected update(deltaTime: number) {
        super.update(deltaTime);
        if (this.isTimeOver) {
            if (!this.isNextShotReady) {
                this.emitNextShot();
            }
            this.emit(druid.Event.DONE);
            this.destroy({ children: true });
        } else {
            if (!this.isNextShotReady) {
                this.passedTime += deltaTime;
                if (this.passedTime >= this.shotDelay) {
                    this.emitNextShot();
                }
            }
            this.x += Math.sin(this.rotation + Math.PI / 2) * Shell.SPEED;
            this.y -= Math.cos(this.rotation + Math.PI / 2) * Shell.SPEED;
        }
    }

    private emitNextShot() {
        this.isNextShotReady = true;
        this.emit(AbstractProjectile.NEW_SHOT);
    }
}
