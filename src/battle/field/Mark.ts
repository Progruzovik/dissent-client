import Field from "./Field";
import Unit from "../unit/Unit";
import * as game from "../../game";

export default class Mark extends game.Rectangle {

    private col: number;
    private row: number;

    constructor(color: number, cell: PIXI.Point = null) {
        super(color, Unit.WIDTH - Field.LINE_WIDTH, Unit.HEIGHT - Field.LINE_WIDTH);
        this.interactive = true;
        this.alpha = 0.4;
        if (cell) {
            this.cell = cell;
        }
    }

    set cell(value: PIXI.Point) {
        this.col = value.x;
        this.row = value.y;
        this.x = value.x * Unit.WIDTH + Field.LINE_WIDTH;
        this.y = value.y * Unit.HEIGHT + Field.LINE_WIDTH;
    }
}
