import * as PIXI from "pixi.js"

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
