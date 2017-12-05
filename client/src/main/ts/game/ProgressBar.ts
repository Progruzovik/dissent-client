import { Rectangle } from "./Rectangle";
import { CENTER } from "./util";
import * as PIXI from "pixi.js";

export class ProgressBar extends PIXI.Container {

    private _value: number;
    private _width: number;

    private readonly bar: Rectangle;
    private readonly txtMain = new PIXI.Text("", { fill: 0xffffff, fontSize: 20 });

    constructor(width: number, height: number = 15, color: number = 0x000000,
                private _maximum: number = 100, private _minimum: number = 0) {
        super();
        this.bar = new Rectangle(0, height, color);
        this.addChild(this.bar);
        this.txtMain.anchor.set(CENTER, CENTER);
        this.txtMain.y = height / 2;
        this.addChild(this.txtMain);

        this.value = this.minimum;
        this.width = width;
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

    get text(): string {
        return this.txtMain.text;
    }

    set text(value: string) {
        this.txtMain.text = value;
    }

    get width(): number {
        return this._width;
    }

    set width(value: number) {
        this._width = value;
        this.txtMain.x = value / 2;
        this.calculateBarWidth();
    }

    private calculateBarWidth() {
        this.bar.width = (this.value - this.minimum) / (this.maximum - this.minimum) * this.width;
    }
}
