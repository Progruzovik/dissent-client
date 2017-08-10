import * as PIXI from "pixi.js";

export abstract class AbstractGun extends PIXI.utils.EventEmitter {

    constructor(readonly radius: number) {
        super();
    }

    abstract shoot(fromX: number, fromY: number, toX: number, toY: number, container: PIXI.Container);
}
