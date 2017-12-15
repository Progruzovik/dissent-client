import { Shape } from "./Shape";

export class Frame extends Shape {

    protected draw() {
        this.lineStyle(this.thickness, this.color);
        this.moveTo(this.thickness / 2, this.thickness / 2);
        this.lineTo(this.width - this.thickness / 2, this.thickness / 2);
        this.lineTo(this.width - this.thickness / 2, this.height - this.thickness / 2);
        this.lineTo(this.thickness / 2, this.height - this.thickness / 2);
        this.lineTo(this.thickness / 2, this.thickness / 2);
    }
}
