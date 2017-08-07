import { Rectangle } from "./Rectangle";
import { Event, CENTER } from "./constant";

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

const enum State {
    MouseOut, MouseOver, MouseDown
}
