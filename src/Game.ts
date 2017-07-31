import * as PIXI from "pixi.js"

export const INDENT = 20;

export namespace Event {

    export const BUTTON_CLICK = "buttonClick";
    export const CLICK = "click";
    export const UPDATE = "update";

    export const MOUSE_OVER = "mouseover";
    export const MOUSE_DOWN = "mousedown";
    export const MOUSE_MOVE = "mousemove";
    export const MOUSE_UP = "mouseup";
    export const MOUSE_OUT = "mouseout";

    export const TOUCH_START = "touchstart";
    export const TOUCH_END = "touchend";

    export const READY = "ready";
    export const FINISH = "finish";
}

export class Actor extends PIXI.Container {

    constructor() {
        super();
        this.on(Event.UPDATE, () => {
            for (const child of this.children) {
                child.emit(Event.UPDATE);
            }
        });
    }
}

export class Rectangle extends PIXI.Graphics {

    constructor(width: number, height: number, color: number = 0x000000) {
        super();
        this.drawRectangle(color, width, height);
    }

    drawRectangle(color: number, width: number = this.width, height: number = this.height) {
        this.clear();
        this.beginFill(color);
        this.drawRect(0, 0, width, height);
        this.endFill();
    }
}

export class Button extends Rectangle {

    private static readonly WIDTH = 165;
    private static readonly HEIGHT = 40;

    private state = State.MouseOut;

    constructor(text: string) {
        super(Button.WIDTH, Button.HEIGHT, 0x333333);
        this.interactive = true;
        this.buttonMode = true;

        const txtMain = new PIXI.Text(text, { fill: 0xFFFFFF, fontSize: 26 });
        txtMain.anchor.set(CENTER, CENTER);
        txtMain.x = this.width / 2;
        txtMain.y = this.height / 2;
        this.addChild(txtMain);

        this.on(Event.MOUSE_OVER, () => this.setState(State.MouseOver));
        this.on(Event.MOUSE_DOWN, () => this.setState(State.MouseDown));
        this.on(Event.MOUSE_UP, () => {
            this.setState(State.MouseOver);
            if (this.buttonMode) {
                this.emit(Event.BUTTON_CLICK);
            }
        });
        this.on(Event.MOUSE_OUT, () => this.setState(State.MouseOut));
        this.on(Event.TOUCH_START, () => this.setState(State.MouseDown));
        this.on(Event.TOUCH_END, () => {
            this.setState(State.MouseOut);
            if (this.buttonMode) {
                this.emit(Event.BUTTON_CLICK);
            }
        });
    }

    setSelectable(value: boolean) {
        if (this.buttonMode != value) {
            this.buttonMode = value;
            this.updateColor();
        }
    }

    private setState(value: State) {
        if (this.state != value) {
            this.state = value;
            this.updateColor();
        }
    }

    private updateColor() {
        let color: number;
        if (this.buttonMode) {
            if (this.state == State.MouseOut) {
                color = 0x333333;
            } else if (this.state == State.MouseOver) {
                color = 0x666666;
            } else if (this.state == State.MouseDown) {
                color = 0x222222;
            }
        } else {
            color = 0x666666;
        }
        this.drawRectangle(color);
    }
}

const enum State { MouseOut, MouseOver, MouseDown }
const CENTER = 0.5;
