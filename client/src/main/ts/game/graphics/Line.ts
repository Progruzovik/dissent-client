import { Shape } from "./Shape";
import { Point } from "../util";

export class Line extends Shape {

    constructor(width: number = 0, thickness: number = 1, color: number = 0x000000) {
        super(width, 0, thickness, color);
    }

    get height(): number {
        return this.thickness;
    }

    set height(value: number) {
        this.thickness = value;
    }

    direct(to: Point, from: Point = this.position) {
        const dx = to.x - from.x, dy = to.y - from.y;
        this.width = Math.sqrt(dx * dx + dy * dy);
        this.rotation = Math.atan2(dy, dx);
        this.pivot.y = this.thickness / 2;
    }

    protected draw() {
        this.lineStyle(this.thickness, this.color);
        this.moveTo(0, this.thickness / 2);
        this.lineTo(this.width, this.thickness / 2);
    }
}
