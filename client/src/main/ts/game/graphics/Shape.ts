import * as PIXI from "pixi.js";

export abstract class Shape extends PIXI.Graphics {

    constructor(private _width: number = 0, private _height: number = 0,
                private _thickness: number = 1, private _color: number = 0x000000) {
        super();
        this.draw();
    }

    get color(): number {
        return this._color;
    }

    set color(value: number) {
        this._color = value;
        this.redraw();
    }

    get width(): number {
        return this._width;
    }

    set width(value: number) {
        this._width = value;
        this.redraw();
    }

    get height(): number {
        return this._height;
    }

    set height(value: number) {
        this._height = value;
        this.redraw();
    }

    get thickness(): number {
        return this._thickness;
    }

    set thickness(value: number) {
        this._thickness = value;
        this.redraw();
    }

    protected abstract draw();

    private redraw() {
        this.clear();
        this.draw();
    }
}
