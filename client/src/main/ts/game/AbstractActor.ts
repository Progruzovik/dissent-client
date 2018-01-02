import * as PIXI from "pixi.js";

export abstract class AbstractActor extends PIXI.Container {

    constructor() {
        super();
        PIXI.ticker.shared.add(this.update, this);
    }
    
    destroy() {
        PIXI.ticker.shared.remove(this.update, this);
        super.destroy({ children: true });
    }

    protected abstract update();
}
