import { AbstractGun } from "./AbstractGun";
import * as game from "../../game";

export default class Blaster extends AbstractGun {

    private fromX = 0;
    private fromY = 0;
    private toX = 0;
    private toY = 0;
    private multiplierX = 0;
    private multiplierY = 0;

    private shot: game.Rectangle;

    constructor() {
        super(15);
    }

    shoot(fromX: number, fromY: number, toX: number, toY: number, container: PIXI.Container) {
        this.fromX = fromX;
        this.fromY = fromY;
        this.toX = toX;
        this.toY = toY;
        this.multiplierX = this.toX > this.fromX ? 1 : -1;
        this.multiplierY = this.toY > this.fromY ? 1 : -1;

        this.shot = new game.Rectangle(25, 5, 0x0000FF);
        this.shot.rotation = Math.atan2(this.toY - this.fromY, this.toX - this.fromX);
        this.shot.pivot.x = this.shot.width / 2;
        this.shot.pivot.y = this.shot.height / 2;
        this.shot.x = this.fromX;
        this.shot.y = this.fromY;
        container.addChild(this.shot);
        PIXI.ticker.shared.add(this.update, this);
    }

    protected update() {
        this.shot.x += Math.sin(this.shot.rotation + Math.PI / 2) * 30;
        this.shot.y -= Math.cos(this.shot.rotation + Math.PI / 2) * 30;
        if (this.shot.x > this.toX * this.multiplierX && this.shot.y > this.toY * this.multiplierY) {
            PIXI.ticker.shared.remove(this.update, this);
            this.shot.destroy();
            this.emit(game.Event.DONE);
        }
    }
}
