import { Rectangle } from "./Rectangle";
import * as PIXI from "pixi.js";

export class ProgressBar extends PIXI.Container {

    private _value: number;
    private readonly bar: Rectangle;

    constructor(private _width: number, height: number, color: number = 0x000000,
                private _maximum: number = 100, private _minimum: number = 0) {
        super();
        this.bar = new Rectangle(0, height, color);
        this.value = this.minimum;
        this.addChild(this.bar);
    }

    get minimum(): number {
        return this._minimum;
    }

    set minimum(value: number) {
        this._minimum = value;
        this.calculateBarWidth();
    }

    get maximum(): number {
        return this._maximum;
    }

    set maximum(value: number) {
        this._maximum = value;
        this.calculateBarWidth();
    }

    get value(): number {
        return this._value;
    }

    set value(value: number) {
        if (value < this.minimum) {
            this._value = this.minimum;
        } else if (value > this.maximum) {
            this._value = this.maximum;
        } else {
            this._value = value;
        }
        this.calculateBarWidth();
    }

    get width(): number {
        return this._width;
    }

    set width(value: number) {
        this._width = value;
        this.calculateBarWidth();
    }

    private calculateBarWidth() {
        this.bar.width = (this.value - this.minimum) / (this.maximum - this.minimum) * this.width;
    }
}
