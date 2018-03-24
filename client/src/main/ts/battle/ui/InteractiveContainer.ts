import * as druid from "pixi-druid";
import * as PIXI from "pixi.js";

export class InteractiveContainer extends PIXI.Container {

    private readonly frame: druid.Frame;

    constructor(private readonly _width: number, private readonly _height: number, frameColor: number) {
        super();
        this.interactive = true;
        this.buttonMode = true;
        this.frame = new druid.Frame(this.width, this.height, frameColor);

        this.on(druid.Event.MOUSE_OVER, () => this.addChild(this.frame));
        this.on(druid.Event.MOUSE_OUT, () => this.removeChild(this.frame));
    }

    get width(): number {
        return this._width;
    }

    get height(): number {
        return this._height;
    }
}
