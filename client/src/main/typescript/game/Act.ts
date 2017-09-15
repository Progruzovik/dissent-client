import { Event } from "./util";
import * as PIXI from "pixi.js";

export class Act extends PIXI.Container {

    private isLeftMouseButtonDown = false;
    private freeWidth = 0;
    private freeHeight = 0;
    private readonly savedMousePosition = new PIXI.Point();

    private _content: PIXI.Container;
    private _leftUi: PIXI.Container;
    private _rightUi: PIXI.Container;
    private _topUi: PIXI.Container;
    private _bottomUi: PIXI.Container;

    private readonly contentLayer = new PIXI.Container();

    constructor(private _width: number, private _height: number) {
        super();
        this.freeWidth = this.width;
        this.freeHeight = this.height;
        this.contentLayer.interactive = true;
        this.addChild(this.contentLayer);

        this.contentLayer.on(Event.MOUSE_DOWN, (e: PIXI.interaction.InteractionEvent) => {
            this.isLeftMouseButtonDown = true;
            this.savedMousePosition.set(e.data.global.x, e.data.global.y);
        });
        this.contentLayer.on(Event.MOUSE_MOVE, (e: PIXI.interaction.InteractionEvent) => {
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
        });
        this.contentLayer.on(Event.MOUSE_UP, () => this.isLeftMouseButtonDown = false);
        this.contentLayer.on(Event.MOUSE_OUT, () => this.isLeftMouseButtonDown = false);
    }

    get width(): number {
        return this._width;
    }

    get height(): number {
        return this._height;
    }

    get content(): PIXI.Container {
        return this._content;
    }

    set content(value: PIXI.Container) {
        if (this.content) {
            this.contentLayer.removeChild(this.content);
        }
        this._content = value;
        if (value) {
            this.contentLayer.addChild(value);
        }
    }

    get leftUi(): PIXI.Container {
        return this._leftUi;
    }

    set leftUi(value: PIXI.Container) {
        if (this.leftUi) {
            this.freeWidth += this.leftUi.width;
            this.removeChild(this.leftUi);
        }
        this._leftUi = value;
        if (value) {
            this.freeWidth -= value.width;
            this.addChild(value);
        }
    }

    get rightUi(): PIXI.Container {
        return this._rightUi;
    }

    set rightUi(value: PIXI.Container) {
        if (this.rightUi) {
            this.freeWidth += this.leftUi.width;
            this.removeChild(this.rightUi);
        }
        this._rightUi = value;
        if (value) {
            this.freeWidth -= value.width;
            this.addChild(value);
        }
    }

    get topUi(): PIXI.Container {
        return this._topUi;
    }

    set topUi(value: PIXI.Container) {
        if (this.topUi) {
            this.freeHeight += this.leftUi.height;
            this.removeChild(this.topUi);
        }
        this._topUi = value;
        if (value) {
            this.freeHeight -= value.height;
            this.addChild(value);
        }
    }

    get bottomUi(): PIXI.Container {
        return this._bottomUi;
    }

    set bottomUi(value: PIXI.Container) {
        if (this.bottomUi) {
            this.freeHeight += this.leftUi.height;
            this.removeChild(this.bottomUi);
        }
        this._bottomUi = value;
        if (value) {
            this.freeHeight -= value.height;
            this.addChild(value);
        }
    }

    resize(width: number = this.width, height: number = this.height) {
        this._width = width;
        this._height = height;
        this.freeWidth = width;
        this.freeHeight = height;
        this.resizeUi();

        if (this.leftUi) {
            this.freeWidth -= this.leftUi.width;
            this.contentLayer.x = this.leftUi.width;
        }
        if (this.rightUi) {
            this.freeWidth -= this.rightUi.width;
            this.rightUi.x = width - this.rightUi.width;
        }
        if (this.topUi) {
            this.freeHeight -= this.topUi.height;
            this.contentLayer.y = this.topUi.height;
        }
        if (this.bottomUi) {
            this.freeHeight -= this.bottomUi.height;
            this.bottomUi.y = height - this.bottomUi.height;
        }
    }

    protected resizeUi() {}
}
