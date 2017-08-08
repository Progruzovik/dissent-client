import FieldManager from "./FieldManager";
import SignLayer from "./SignLayer";
import Unit from "../unit/Unit";
import * as game from "../../game";

export default class Field extends game.MovableByMouse {

    static readonly LINE_WIDTH = 2;

    constructor(freeWidth: number, freeHeight: number, fieldManager: FieldManager) {
        super(new game.Actor(), freeWidth, freeHeight);
        this.interactive = true;

        this.addChild(new game.Rectangle(freeWidth, freeHeight, 0x111111));
        for (let i = 0; i <= fieldManager.rowsCount; i++) {
            const line = new game.Rectangle(fieldManager.colsCount * Unit.WIDTH + Field.LINE_WIDTH,
                Field.LINE_WIDTH, 0x777777);
            line.y = i * Unit.HEIGHT;
            this.content.addChild(line);
        }
        for (let i = 0; i <= fieldManager.colsCount; i++) {
            const line = new game.Rectangle(Field.LINE_WIDTH,
                fieldManager.rowsCount * Unit.HEIGHT + Field.LINE_WIDTH, 0x777777);
            line.x = i * Unit.WIDTH;
            this.content.addChild(line);
        }

        const signLayer = new SignLayer(fieldManager);
        this.content.addChild(signLayer);
        for (const unit of fieldManager.unitManager.units) {
            this.content.addChild(unit);
        }
        this.addChild(this.content);

        signLayer.on(game.Event.MOUSE_UP, () => this.isLeftMouseButtonDown = false);
    }
}
