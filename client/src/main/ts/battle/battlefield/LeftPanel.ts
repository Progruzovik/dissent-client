import Field from "./Field";
import Unit from "./unit/Unit";
import UnitService from "./unit/UnitService";
import { ActionType } from "../util";
import { l } from "../../localizer";
import * as druid from "pixi-druid";
import * as PIXI from "pixi.js";

export default class LeftPanel extends druid.AbstractBranch {

    private readonly txtActionPoints = new PIXI.Text("", { align: "center", fill: "white",
        fontSize: 36, fontWeight: "bold", stroke: "blue", strokeThickness: 4 });

    constructor(units: Unit[], private readonly unitService: UnitService) {
        super();
        const layoutQueue = new druid.HorizontalLayout(druid.Alignment.Left, 0);
        for (const unit of units) {
            const iconUnit = new druid.Rectangle(Field.CELL_SIZE.x, Field.CELL_SIZE.y, 0x444444);
            const spriteUnit: PIXI.Sprite = unit.ship.createSprite();
            const factor: number = Math.min(1 / unit.ship.hull.width, 1 / unit.ship.hull.height);
            spriteUnit.scale.set(factor, factor);
            spriteUnit.anchor.set(druid.CENTER, druid.CENTER);
            spriteUnit.position.set(iconUnit.width / 2, iconUnit.height / 2);
            iconUnit.addChild(spriteUnit);
            iconUnit.addChild(new druid.Frame(Field.CELL_SIZE.x, Field.CELL_SIZE.y, 1, unit.frameColor));
            layoutQueue.addElement(iconUnit);

            unit.on(Unit.DESTROY, () => layoutQueue.removeElement(iconUnit));
        }
        this.addChild(layoutQueue);
        this.txtActionPoints.anchor.set(druid.CENTER, 1);
        this.addChild(this.txtActionPoints);

        unitService.on(ActionType.Move, () => this.updateActionPointsValue());
        unitService.on(ActionType.Shot, () => this.updateActionPointsValue());
        unitService.on(ActionType.NextTurn, (isFirst: boolean) => {
            if (!isFirst) {
                layoutQueue.addElement(layoutQueue.removeElement(layoutQueue.getElementAt(0)));
            }
            this.updateActionPointsValue();
        });
    }

    setUpChildren(width: number, height: number) {
        this.txtActionPoints.position.set(width / 2, height);
    }

    private updateActionPointsValue() {
        this.txtActionPoints.text = `${l("ap")}\n${this.unitService.activeUnit.actionPoints}`
            + `/${this.unitService.activeUnit.ship.hull.actionPoints}`;
    }
}
