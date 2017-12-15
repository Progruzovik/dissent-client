import { Rectangle } from "../graphics/Rectangle";
import { CENTER } from "../util";
import * as PIXI from "pixi.js";

export class ProgressBar extends PIXI.Container {

    private _value: number;
    private _width: number;

    private readonly bar: Rectangle;
    private readonly txtMain: PIXI.Text;

    constructor(width: number, height: number = 15, color: number = 0x000000,
                private _maximum: number = 100, private _minimum: number = 0,
                textStyle: PIXI.TextStyleOptions = { fill: "white", fontSize: 18 }) {
        super();
        //{ fill: "white", fontSize: 26, fontWeight: "bold" }
        this.bar = new Rectangle(0, 0, color);
        this.addChild(this.bar);
        this.txtMain = new PIXI.Text("", textStyle);
        this.txtMain.anchor.set(CENTER, CENTER);
        this.addChild(this.txtMain);

        this.value = this.minimum;
        this.width = width;
        this.height = height;
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

    get height(): number {
        return this.bar.height;
    }

    set height(value: number) {
        this.bar.height = value;
        this.txtMain.y = value / 2;
    }

    private calculateBarWidth() {
        this.bar.width = (this.value - this.minimum) / (this.maximum - this.minimum) * this.width;
    }
}
