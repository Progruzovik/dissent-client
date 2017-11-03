import * as PIXI from "pixi.js"

export class Rectangle extends PIXI.Graphics {

    constructor(private _width: number, private _height: number, private _color: number = 0x000000) {
        super();
        this.redraw(this.color, this.width, this.height);
    }

    get color(): number {
        return this._color;
    }

    set color(value: number) {
        this._color = value;
        this.redraw(value, this.width, this.height);
    }

    get width(): number {
        return this._width;
    }

    set width(value: number) {
        this._width = value;
        this.redraw(this.color, value, this.height);
    }

    get height(): number {
        return this._height;
    }

    set height(value: number) {
        this._height = value;
        this.redraw(this.color, this.width, value);
    }

    private redraw(color: number, width: number, height: number) {
        this.clear();
        this.beginFill(color);
        this.drawRect(0, 0, width, height);
        this.endFill();
    }
}
