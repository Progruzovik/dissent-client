import Field from "./Field";
import Unit from "./unit/Unit";
import UnitService from "./unit/UnitService";
import { ActionType, Side } from "../util";
import { l } from "../../localizer";
import * as game from "../../game";
import * as PIXI from "pixi.js";

export default class LeftUi extends game.AbstractBranch {

    private readonly bgQueue = new PIXI.Container();
    private readonly txtActionPoints = new PIXI.Text("", { align: "center", fill: "white",
        fontSize: 36, fontWeight: "bold", stroke: "blue", strokeThickness: 4 });

    constructor(units: Unit[], private readonly unitService: UnitService) {
        super();
        units.forEach((u, i) => {
            const iconUnit = new game.Rectangle(Field.CELL_SIZE.x, Field.CELL_SIZE.y, 0x444444);
            const spriteUnit: PIXI.Sprite = u.ship.createSprite();
            const factor: number = Math.min(1 / u.ship.hull.width, 1 / u.ship.hull.height);
            spriteUnit.scale.set(factor, factor);
            spriteUnit.anchor.set(game.CENTER, game.CENTER);
            spriteUnit.position.set(iconUnit.width / 2, iconUnit.height / 2);
            iconUnit.addChild(spriteUnit);
            iconUnit.addChild(new game.Frame(Field.CELL_SIZE.x, Field.CELL_SIZE.y, 1, u.frameColor));
            this.bgQueue.addChild(iconUnit);

            u.on(Unit.DESTROY, () => {
                this.bgQueue.removeChild(iconUnit);
                this.updateUnitSpritePositions();
            });
        });
        this.addChild(this.bgQueue);
        this.txtActionPoints.anchor.set(game.CENTER, 1);
        this.addChild(this.txtActionPoints);
        this.updateUnitSpritePositions();

        unitService.on(ActionType.Move, () => this.updateActionPointsValue());
        unitService.on(ActionType.Shot, () => this.updateActionPointsValue());
        unitService.on(ActionType.NextTurn, (isFirst: boolean) => {
            if (!isFirst) {
                this.bgQueue.setChildIndex(this.bgQueue.getChildAt(0), this.bgQueue.children.length - 1);
                this.updateUnitSpritePositions();
            }
            this.updateActionPointsValue();
        });
    }

    setUpChildren(width: number, height: number) {
        this.txtActionPoints.position.set(width / 2, height);
    }

    private updateUnitSpritePositions() {
        this.bgQueue.children.forEach((c, i) => c.y = Field.CELL_SIZE.y * i);
    }

    private updateActionPointsValue() {
        this.txtActionPoints.text = `${l("ap")}\n${this.unitService.currentUnit.actionPoints}`
            + `/${this.unitService.currentUnit.ship.hull.actionPoints}`;
    }
}
