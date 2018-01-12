import { Shape } from "./Shape";

export class Rectangle extends Shape {

    constructor(width: number = 0, height: number = 0, color: number = 0x000000) {
        super(width, height, 0, color);
    }

    protected draw() {
        this.graphics.beginFill(this.color);
        this.graphics.drawRect(0, 0, this.width, this.height);
        this.graphics.endFill();
    }
}
