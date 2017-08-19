import { Rectangle } from "./Rectangle";
import { Event, CENTER } from "./constant";

export class Button extends PIXI.Container {

    private _state: State;
    private readonly bg = new PIXI.Container();

    constructor(text: string,
                private readonly bgMouseOut: PIXI.Container = new Rectangle(165, 40, 0x333333),
                private readonly bgMouseOver: PIXI.Container = new Rectangle(165, 40, 0x666666),
                private readonly bgMouseDown: PIXI.Container = new Rectangle(165, 40, 0x222222),
                private readonly bgDisabled: PIXI.Container = new Rectangle(165, 40, 0x666666)) {
        super();
        this.interactive = true;
        this.buttonMode = true;
        this.addChild(this.bg);
        this.state = State.MouseOut;

        const txtMain = new PIXI.Text(text, { fill: 0xFFFFFF, fontSize: 26 });
        txtMain.anchor.set(CENTER, CENTER);
        txtMain.x = this.width / 2;
        txtMain.y = this.height / 2;
        this.addChild(txtMain);

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

    set isEnabled(value: boolean) {
        this.buttonMode = value;
        this.updateBg();
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
