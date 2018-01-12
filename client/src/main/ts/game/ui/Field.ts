import { AbstractBranch, Event } from "../";

export class Field extends AbstractBranch {

    private _width: number;
    private _height: number;

    private isLeftMouseButtonDown = false;
    private readonly savedMousePosition = new PIXI.Point();

    readonly content = new PIXI.Container();

    constructor() {
        super();
        this.interactive = true;
        this.addChild(this.content);

        this.on(Event.MOUSE_DOWN, (e: PIXI.interaction.InteractionEvent) => {
            this.isLeftMouseButtonDown = true;
            this.savedMousePosition.set(e.data.global.x, e.data.global.y);
        });
        this.on(Event.MOUSE_MOVE, (e: PIXI.interaction.InteractionEvent) => {
            if (this.isLeftMouseButtonDown) {
                this.content.x += e.data.global.x - this.savedMousePosition.x;
                if (this.content.x > 0) {
                    this.content.x = 0;
                } else {
                    const leftBorder = this.width - this.content.width;
                    if (leftBorder > 0) {
                        this.content.x = 0;
                    } else if (this.content.x < leftBorder) {
                        this.content.x = leftBorder;
                    }
                }
                this.content.y += e.data.global.y - this.savedMousePosition.y;
                if (this.content.y > 0) {
                    this.content.y = 0;
                } else {
                    const topBorder = this.height - this.content.height;
                    if (topBorder > 0) {
                        this.content.y = 0;
                    } else if (this.content.y < topBorder) {
                        this.content.y = topBorder;
                    }
                }
                this.savedMousePosition.set(e.data.global.x, e.data.global.y);
            }
        });
        this.on(Event.MOUSE_UP, () => this.isLeftMouseButtonDown = false);
        this.on(Event.MOUSE_OUT, () => this.isLeftMouseButtonDown = false);
    }

    get width(): number {
        return this._width;
    }

    get height(): number {
        return this._height;
    }

    setUpChildren(width: number, height: number) {
        this._width = width;
        this._height = height;
    }
}
