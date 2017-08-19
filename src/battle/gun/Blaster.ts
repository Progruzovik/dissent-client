import { AbstractGun } from "./AbstractGun";
import * as game from "../../game";

export default class Blaster extends AbstractGun {

    private static readonly SHOTS_COUNT = 2;

    private fromX = 0;
    private fromY = 0;
    private toX = 0;
    private toY = 0;
    private container: PIXI.Container;

    private firedShots = 0;
    private reachedShots = 0;
    private frameNumber = 0;

    constructor() {
        super(15);

        this.on(game.Event.UPDATE, () => {
            if (this.firedShots < Blaster.SHOTS_COUNT) {
                console.log(this.frameNumber);
                if (this.frameNumber % 15 == 0) {
                    const shot = new game.Rectangle(20, 3, 0x0000FF);
                    shot.rotation = Math.atan2(this.toY - this.fromY, this.toX - this.fromX);
                    shot.pivot.x = shot.width / 2;
                    shot.pivot.y = shot.height / 2;
                    shot.x = this.fromX;
                    shot.y = this.fromY;
                    this.container.addChild(shot);
                    this.firedShots++;

                    const multiplierX: number = this.toX > this.fromX ? 1 : -1;
                    const multiplierY: number = this.toY > this.fromY ? 1 : -1;
                    shot.on(game.Event.UPDATE, () => {
                        shot.x += Math.sin(shot.rotation + Math.PI / 2) * 35;
                        shot.y -= Math.cos(shot.rotation + Math.PI / 2) * 35;
                        if (shot.x > this.toX * multiplierX && shot.y > this.toY * multiplierY) {
                            this.reachedShots++;
                            if (this.reachedShots == Blaster.SHOTS_COUNT) {
                                this.emit(game.Event.DONE);
                            }
                            this.container.removeChild(shot);
                        }
                    });
                }
                this.frameNumber++;
            }
        });
    }

    shoot(fromX: number, fromY: number, toX: number, toY: number, container: PIXI.Container) {
        this.fromX = fromX;
        this.fromY = fromY;
        this.toX = toX;
        this.toY = toY;
        this.container = container;
        this.firedShots = 0;
        this.reachedShots = 0;
        this.frameNumber = 0;
    }
}
