export abstract class Shape extends PIXI.Graphics {

    constructor(private _color: number, private _width: number,
                private _height: number, readonly lineThickness: number = 0) {
        super();
        this.redraw();
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

    protected abstract redraw();
}
