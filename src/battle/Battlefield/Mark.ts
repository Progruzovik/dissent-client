import Field from "./Field";
import Unit from "../Unit";
import * as game from "../../game";

export default class Mark extends game.Rectangle {

    constructor(color: number) {
        super(Unit.WIDTH - Field.LINE_WIDTH, Unit.HEIGHT - Field.LINE_WIDTH, color);
        this.interactive = true;
        this.alpha = 0.4;
    }

    setCell(col: number, row: number) {
        this.x = col * Unit.WIDTH + Field.LINE_WIDTH;
        this.y = row * Unit.HEIGHT + Field.LINE_WIDTH;
    }
}
