import SignLayer from "./SignLayer";
import Unit from "./Unit";
import UnitManager from "./UnitManager";
import * as game from "../../game";

export default class Field extends game.MovableByMouse {

    static readonly LINE_WIDTH = 2;

    constructor(colsCount: number, rowsCount: number,
                freeWidth: number, freeHeight: number, unitManager: UnitManager) {
        super(new game.Actor(), freeWidth, freeHeight);
        this.interactive = true;

        this.addChild(new game.Rectangle(freeWidth, freeHeight, 0x111111));
        for (let i = 0; i <= rowsCount; i++) {
            const line = new game.Rectangle(colsCount * Unit.WIDTH + Field.LINE_WIDTH, Field.LINE_WIDTH, 0x777777);
            line.y = i * Unit.HEIGHT;
            this.content.addChild(line);
        }
        for (let i = 0; i <= colsCount; i++) {
            const line = new game.Rectangle(Field.LINE_WIDTH, rowsCount * Unit.HEIGHT + Field.LINE_WIDTH, 0x777777);
            line.x = i * Unit.WIDTH;
            this.content.addChild(line);
        }

        const signLayer = new SignLayer(colsCount, rowsCount, unitManager);
        this.content.addChild(signLayer);
        for (const unit of unitManager.units) {
            this.content.addChild(unit);

            unit.on(Unit.PREPARED_TO_SHOT, () => signLayer.markTargets(!unit.isLeft));
            unit.on(Unit.NOT_PREPARED_TO_SHOT, () => signLayer.addPathMarks());
        }
        this.addChild(this.content);

        signLayer.on(game.Event.MOUSE_UP, () => this.isLeftMouseButtonDown = false);
    }
}
