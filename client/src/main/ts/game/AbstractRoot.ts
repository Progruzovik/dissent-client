import * as game from "./";
import * as PIXI from "pixi.js";

export abstract class AbstractRoot extends PIXI.Container implements game.Resizable {

    private _width = 0;
    private _height = 0;

    get width(): number {
        return this._width;
    }

    get height(): number {
        return this._height;
    }

    setUpChildren(width: number, height: number) {
        this._width = width;
        this._height = height;
        this.onSetUpChildren(width, height);
    }

    addChild<T extends PIXI.DisplayObject>(child: T, ...additionalChildren: PIXI.DisplayObject[]): T {
        const result: T = super.addChild(child);
        this.setUpChildren(this.width, this.height);
        return result;
    }

    addChildAt<T extends PIXI.DisplayObject>(child: T, index: number): T {
        const result: T = super.addChildAt(child, index);
        this.setUpChildren(this.width, this.height);
        return result;
    }

    protected abstract onSetUpChildren(width: number, height: number);
}
