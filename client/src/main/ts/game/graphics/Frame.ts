import { Shape } from "./Shape";

export class Frame extends Shape {

    constructor(width: number = 0, height: number = 0, lineThickness: number = 1, color: number = 0x000000) {
        super(color, width, height, lineThickness);
    }

    protected redraw() {
        this.clear();
        this.lineStyle(this.lineThickness, this.color);
        this.moveTo(this.lineThickness, this.lineThickness);
        this.lineTo(this.width, this.lineThickness);
        this.lineTo(this.width, this.height);
        this.lineTo(this.lineThickness, this.height);
        this.lineTo(this.lineThickness, this.lineThickness);
    }
}
