import Unit from "./unit/Unit";
import UnitService from "./unit/UnitService";
import { ActionType, Side } from "../util";
import * as game from "../../game";
import * as PIXI from "pixi.js";

export default class LeftUi extends game.UiElement {

    private readonly bgQueue = new game.Rectangle(0x000000, Unit.WIDTH);
    private readonly txtActionPoints = new PIXI.Text("", { fill: 0xffffff, fontSize: 26 });

    constructor(currentPlayerSide: Side, private readonly unitService: UnitService) {
        super();
        this.unitService.units.forEach((u, i) => {
            const unitIcon = new game.Rectangle(currentPlayerSide == u.side ? 0x00ff00 : 0xff0000,
                Unit.WIDTH, Unit.HEIGHT);
            unitIcon.addChild(new PIXI.Sprite(PIXI.loader.resources[u.hull.texture.name].texture));
            unitIcon.y = Unit.HEIGHT * i;
            this.bgQueue.addChild(unitIcon);

            u.on(Unit.DESTROY, () => {
                this.bgQueue.removeChild(unitIcon);
                this.updateUnitSpritePositions();
            });
        });
        this.addChild(this.bgQueue);
        this.txtActionPoints.anchor.x = game.CENTER;
        this.txtActionPoints.x = this.bgQueue.width / 2;
        this.addChild(this.txtActionPoints);

        this.unitService.on(ActionType.Move, () => this.updateActionPointsValue());
        this.unitService.on(ActionType.Shot, () => this.updateActionPointsValue());
        this.unitService.on(ActionType.NextTurn, (isFirst: boolean) => {
            if (!isFirst) {
                this.bgQueue.setChildIndex(this.bgQueue.getChildAt(0), this.bgQueue.children.length - 1);
                this.updateUnitSpritePositions();
            }
            this.updateActionPointsValue();
        });
    }

    resize(width: number, height: number) {
        this.bgQueue.height = height;
        this.txtActionPoints.y = height - this.txtActionPoints.height;
    }

    private updateUnitSpritePositions() {
        this.bgQueue.children.forEach((c, i) => c.y = Unit.HEIGHT * i);
    }

    private updateActionPointsValue() {
        this.txtActionPoints.text = "AP\n" + this.unitService.currentUnit.actionPoints
            + "/" + this.unitService.currentUnit.hull.speed;
    }
}
