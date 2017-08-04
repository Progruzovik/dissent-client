import SignLayer from "./SignLayer";
import Unit from "./Unit";
import UnitManager from "./UnitManager";
import * as game from "../../game";

export default class Field extends game.Actor {

    static readonly LINE_WIDTH = 2;

    private isMouseDown = false;
    private mouseX: number;
    private mouseY: number;

    private readonly content = new game.Actor();
    private readonly signLayer: SignLayer;

    constructor(colsCount: number, rowsCount: number, freeWidth: number, freeHeight: number,
                unitManager: UnitManager) {
        super();
        this.interactive = true;
        this.signLayer = new SignLayer(colsCount, rowsCount, unitManager);

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
        this.content.addChild(this.signLayer);
        for (const unit of unitManager.units) {
            this.content.addChild(unit);

            unit.on(Unit.PREPARED_TO_SHOT, () => this.signLayer.markTargets(!unit.isLeft));
            unit.on(Unit.NOT_PREPARED_TO_SHOT, () => this.signLayer.addPathMarks());
        }
        this.addChild(this.content);

        this.signLayer.on(game.Event.MOUSE_UP, () => this.isMouseDown = false);
        this.on(game.Event.MOUSE_DOWN, (e: PIXI.interaction.InteractionEvent) => {
            this.isMouseDown = true;
            this.mouseX = e.data.global.x;
            this.mouseY = e.data.global.y;
        });
        this.on(game.Event.MOUSE_MOVE, (e: PIXI.interaction.InteractionEvent) => {
            if (this.isMouseDown) {
                this.content.x += e.data.global.x - this.mouseX;
                if (this.content.x > 0) {
                    this.content.x = 0;
                } else {
                    const leftBorder: number = freeWidth - this.content.width;
                    if (leftBorder > 0) {
                        this.content.x = 0;
                    } else if (this.content.x < leftBorder) {
                        this.content.x = leftBorder;
                    }
                }
                this.content.y += e.data.global.y - this.mouseY;
                if (this.content.y > 0) {
                    this.content.y = 0;
                } else {
                    const topBorder: number = freeHeight - this.content.height;
                    if (topBorder > 0) {
                        this.content.y = 0;
                    } else if (this.content.y < topBorder) {
                        this.content.y = topBorder;
                    }
                }
                this.mouseX = e.data.global.x;
                this.mouseY = e.data.global.y;
            }
        });
        this.on(game.Event.MOUSE_UP, () => this.isMouseDown = false);
        this.on(game.Event.MOUSE_OUT, () => this.isMouseDown = false);
    }
}
