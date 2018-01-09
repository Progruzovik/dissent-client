import * as PIXI from "pixi.js";

export abstract class AbstractActor extends PIXI.Container {

    constructor() {
        super();
        PIXI.ticker.shared.add(this.update, this);
    }
    
    destroy(options?: PIXI.DestroyOptions | boolean) {
        PIXI.ticker.shared.remove(this.update, this);
        super.destroy(options);
    }

    protected abstract update(deltaTime: number);
}
