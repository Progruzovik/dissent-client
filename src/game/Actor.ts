import { Event } from "./constant";
import * as PIXI from "pixi.js";

export class Actor extends PIXI.Container {

    constructor() {
        super();
        this.on(Event.UPDATE, () => {
            for (const child of this.children) {
                child.emit(Event.UPDATE);
            }
        });
    }
}
