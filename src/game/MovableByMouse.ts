import { Event } from "./constant"

export class MovableByMouse extends PIXI.Container {

    private isLeftMouseButtonDown = false;
    private savedMousePosition = new PIXI.Point();

    protected readonly content = new PIXI.Container();

    constructor(private freeWidth: number = 0, private freeHeight: number = 0) {
        super();
        this.interactive = true;

        this.on(Event.MOUSE_DOWN, (e: PIXI.interaction.InteractionEvent) => {
            this.isLeftMouseButtonDown = true;
            this.savedMousePosition.set(e.data.global.x, e.data.global.y);
        });
        this.on(Event.MOUSE_MOVE, this.onMouseMove);
        this.on(Event.MOUSE_UP, () => this.isLeftMouseButtonDown = false);
        this.on(Event.MOUSE_OUT, () => this.isLeftMouseButtonDown = false);
    }

    resize(freeWidth: number, freeHeight: number) {
        this.freeHeight = freeHeight;
        this.freeWidth = freeWidth;
    }

    private onMouseMove(e: PIXI.interaction.InteractionEvent) {
        if (this.isLeftMouseButtonDown) {
            this.content.x += e.data.global.x - this.savedMousePosition.x;
            if (this.content.x > 0) {
                this.content.x = 0;
            } else {
                const leftBorder: number = this.freeWidth - this.content.width;
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
                const topBorder: number = this.freeHeight - this.content.height;
                if (topBorder > 0) {
                    this.content.y = 0;
                } else if (this.content.y < topBorder) {
                    this.content.y = topBorder;
                }
            }
            this.savedMousePosition.set(e.data.global.x, e.data.global.y);
        }
    }
}
