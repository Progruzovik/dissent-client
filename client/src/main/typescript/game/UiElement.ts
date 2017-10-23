import * as PIXI from "pixi.js";

export class UiElement extends PIXI.Container {

    resize(width: number, height: number) {
        for (const child of this.children) {
            if (child instanceof UiElement) {
                child.resize(width, height);
            }
        }
    }
}
