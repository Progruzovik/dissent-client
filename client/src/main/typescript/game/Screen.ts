import { UiElement } from "./UiElement";
import { Event } from "./util";
import * as PIXI from "pixi.js";

export class Screen extends UiElement {

    private isLeftMouseButtonDown = false;
    private _width = 0;
    private _height = 0;
    private freeWidth = 0;
    private freeHeight = 0;
    private readonly savedMousePosition = new PIXI.Point();

    private _content: UiElement;
    private _leftUi: UiElement;
    private _rightUi: UiElement;
    private _topUi: UiElement;
    private _bottomUi: UiElement;
    private _frontUi: UiElement;

    private readonly bottomLayer = new PIXI.Container();
    private readonly middleLayer = new PIXI.Container();
    private readonly frontLayer = new PIXI.Container();

    constructor() {
        super();
        this.freeWidth = this.width;
        this.freeHeight = this.height;
        this.bottomLayer.interactive = true;
        this.addChild(this.bottomLayer);
        this.addChild(this.middleLayer);
        this.addChild(this.frontLayer);

        this.bottomLayer.on(Event.MOUSE_DOWN, (e: PIXI.interaction.InteractionEvent) => {
            this.isLeftMouseButtonDown = true;
            this.savedMousePosition.set(e.data.global.x, e.data.global.y);
        });
        this.bottomLayer.on(Event.MOUSE_MOVE, (e: PIXI.interaction.InteractionEvent) => {
            if (this.isLeftMouseButtonDown) {
                this.content.x += e.data.global.x - this.savedMousePosition.x;
                if (this.content.x > 0) {
                    this.content.x = 0;
                } else {
                    const leftBorder = this.freeWidth - this.content.width;
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
                    const topBorder = this.freeHeight - this.content.height;
                    if (topBorder > 0) {
                        this.content.y = 0;
                    } else if (this.content.y < topBorder) {
                        this.content.y = topBorder;
                    }
                }
                this.savedMousePosition.set(e.data.global.x, e.data.global.y);
            }
        });
        this.bottomLayer.on(Event.MOUSE_UP, () => this.isLeftMouseButtonDown = false);
        this.bottomLayer.on(Event.MOUSE_OUT, () => this.isLeftMouseButtonDown = false);
    }

    get width(): number {
        return this._width;
    }

    get height(): number {
        return this._height;
    }

    get content(): UiElement {
        return this._content;
    }

    set content(value: UiElement) {
        if (this.content) {
            this.bottomLayer.removeChild(this.content);
        }
        this._content = value;
        if (value) {
            this.bottomLayer.addChild(value);
        }
        this.resize();
    }

    get leftUi(): UiElement {
        return this._leftUi;
    }

    set leftUi(value: UiElement) {
        if (this.leftUi) {
            this.middleLayer.removeChild(this.leftUi);
        }
        this._leftUi = value;
        if (value) {
            this.middleLayer.addChild(value);
        }
        this.resize();
    }

    get rightUi(): UiElement {
        return this._rightUi;
    }

    set rightUi(value: UiElement) {
        if (this.rightUi) {
            this.middleLayer.removeChild(this.rightUi);
        }
        this._rightUi = value;
        if (value) {
            this.middleLayer.addChild(value);
        }
        this.resize();
    }

    get topUi(): UiElement {
        return this._topUi;
    }

    set topUi(value: UiElement) {
        if (this.topUi) {
            this.middleLayer.removeChild(this.topUi);
        }
        this._topUi = value;
        if (value) {
            this.middleLayer.addChild(value);
        }
        this.resize();
    }

    get bottomUi(): UiElement {
        return this._bottomUi;
    }

    set bottomUi(value: UiElement) {
        if (this.bottomUi) {
            this.middleLayer.removeChild(this.bottomUi);
        }
        this._bottomUi = value;
        if (value) {
            this.middleLayer.addChild(value);
        }
        this.resize();
    }

    get frontUi(): UiElement {
        return this._frontUi;
    }

    set frontUi(value: UiElement) {
        if (this.frontUi) {
            this.frontLayer.removeChild(this.frontUi);
        }
        this._frontUi = value;
        if (value) {
            this.frontLayer.addChild(value);
        }
        this.resize();
    }

    resize(width: number = this.width, height: number = this.height) {
        this._width = width;
        this._height = height;
        this.freeWidth = width;
        this.freeHeight = height;

        if (this.topUi) {
            this.topUi.resize(width, height);
            this.freeHeight -= this.topUi.height;
            this.bottomLayer.y = this.topUi.height;
        }
        if (this.bottomUi) {
            this.bottomUi.resize(width, height);
            this.bottomUi.y = height - this.bottomUi.height;
            this.freeHeight -= this.bottomUi.height;
        }
        if (this.leftUi) {
            this.leftUi.resize(width, this.freeHeight);
            this.freeWidth -= this.leftUi.width;
            this.bottomLayer.x = this.leftUi.width;
        }
        if (this.rightUi) {
            this.rightUi.resize(width, this.freeHeight);
            this.rightUi.x = width - this.rightUi.width;
            this.freeWidth -= this.rightUi.width;
        }
        if (this.content) {
            this.content.resize(this.freeWidth, this.freeHeight);
        }
        if (this.frontUi) {
            this.frontUi.resize(width, height);
        }
    }
}
