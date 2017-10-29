import { Rectangle } from "./Rectangle";
import { Event, CENTER } from "./util";
import * as PIXI from "pixi.js";

export class Button extends PIXI.Container {

    private _state: State;
    private readonly bg = new PIXI.Container();
    private readonly txtMain: PIXI.Text;

    constructor(text = "", width: number = 165, height: number = 40,
                private readonly bgMouseOut: PIXI.Container = new Rectangle(0x333333),
                private readonly bgMouseOver: PIXI.Container = new Rectangle(0x555555),
                private readonly bgMouseDown: PIXI.Container = new Rectangle(0x222222),
                private readonly bgDisabled: PIXI.Container = bgMouseOver) {
        super();
        this.interactive = true;
        this.buttonMode = true;
        this.state = State.MouseOut;
        this.addChild(this.bg);
        this.txtMain = new PIXI.Text(text, { align: "center", fill: 0xffffff, fontSize: 26 });
        this.txtMain.anchor.set(CENTER, CENTER);
        this.addChild(this.txtMain);
        this.width = width;
        this.height = height;

        this.on(Event.MOUSE_OVER, () => this.state = State.MouseOver);
        this.on(Event.MOUSE_DOWN, () => this.state = State.MouseDown);
        this.on(Event.MOUSE_UP, () => {
            this.state = State.MouseOver;
            if (this.buttonMode) {
                this.emit(Event.BUTTON_CLICK);
            }
        });
        this.on(Event.MOUSE_OUT, () => this.state = State.MouseOut);
        this.on(Event.TOUCH_START, () => this.state = State.MouseDown);
        this.on(Event.TOUCH_END, () => {
            this.state = State.MouseOut;
            if (this.buttonMode) {
                this.emit(Event.BUTTON_CLICK);
            }
        });
    }

    get text(): string {
        return this.txtMain.text;
    }

    set text(value: string) {
        this.txtMain.text = value;
    }

    set isEnabled(value: boolean) {
        this.buttonMode = value;
        this.updateBg();
    }

    get width(): number {
        return this.bg.width;
    }

    set width(value: number) {
        this.bgMouseOut.width = value;
        this.bgMouseOver.width = value;
        this.bgMouseDown.width = value;
        this.bgDisabled.width = value;
        this.txtMain.x = value / 2;
    }

    get height() {
        return this.bgMouseOut.height;
    }

    set height(value: number) {
        this.bgMouseOut.height = value;
        this.bgMouseOver.height = value;
        this.bgMouseDown.height = value;
        this.bgDisabled.height = value;
        this.txtMain.y = value / 2;
    }

    private get state(): State {
        return this._state;
    }

    private set state(value: State) {
        if (this._state != value) {
            this._state = value;
            this.updateBg();
        }
    }

    private updateBg() {
        this.bg.removeChildren();
        if (this.buttonMode) {
            if (this.state == State.MouseOut) {
                this.bg.addChild(this.bgMouseOut);
            } else if (this.state == State.MouseOver) {
                this.bg.addChild(this.bgMouseOver);
            } else if (this.state == State.MouseDown) {
                this.bg.addChild(this.bgMouseDown);
            }
        } else {
            this.bg.addChild(this.bgDisabled);
        }
    }
}

const enum State {
    MouseOut, MouseOver, MouseDown
}
