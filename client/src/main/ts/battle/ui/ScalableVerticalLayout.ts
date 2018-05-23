import * as druid from "pixi-druid";

export class ScalableVerticalLayout extends druid.VerticalLayout implements druid.SizeAware {

    private _elementWidth = 0;
    private _elementHeight = 0;

    constructor(private readonly elementRatio: number, spacing: number = 0) {
        super(spacing);
    }

    get elementWidth(): number {
        return this._elementWidth;
    }

    get elementHeight(): number {
        return this._elementHeight;
    }

    resize(width: number, height: number): void {
        this._elementWidth = width / this.elementsCount;
        this._elementHeight = this.elementWidth / this.elementRatio;
        for (const element of this.elements) {
            element.width = this.elementWidth;
            element.height = this.elementHeight;
        }
        this.updateElements();
    }
}
