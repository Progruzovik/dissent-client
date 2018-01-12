import { Shape } from "./Shape";

export class Frame extends Shape {

    protected draw() {
        this.graphics.lineStyle(this.thickness, this.color);
        this.graphics.moveTo(this.thickness / 2, this.thickness / 2);
        this.graphics.lineTo(this.width - this.thickness / 2, this.thickness / 2);
        this.graphics.lineTo(this.width - this.thickness / 2, this.height - this.thickness / 2);
        this.graphics.lineTo(this.thickness / 2, this.height - this.thickness / 2);
        this.graphics.lineTo(this.thickness / 2, this.thickness / 2);
    }
}
