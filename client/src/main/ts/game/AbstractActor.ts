import { Event } from "./util";
import * as PIXI from "pixi.js";

export abstract class AbstractActor extends PIXI.Container {

    constructor() {
        super();
        this.on(Event.ADDED, () => PIXI.ticker.shared.add(this.update, this));
        this.on(Event.REMOVED, () => PIXI.ticker.shared.remove(this.update, this));
    }

    protected abstract update(deltaTime: number);
}
