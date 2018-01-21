import Field from "./Field";
import Unit from "../unit/Unit";
import UnitService from "../unit/UnitService";
import { ActionType } from "../../util";
import { l } from "../../../localizer";
import * as druid from "pixi-druid";
import * as PIXI from "pixi.js";

export default class LeftPanel extends druid.AbstractBranch {

    private freeHeight = 0;

    private readonly txtActionPoints = new PIXI.Text("", { align: "center", fill: "white",
        fontSize: 36, fontWeight: "bold", stroke: "blue", strokeThickness: 4 });

    private activeUnit: PIXI.Container;
    private readonly layoutQueue = new druid.HorizontalLayout(druid.Alignment.Left, 0);

    constructor(units: Unit[], private readonly unitService: UnitService) {
        super();
        this.txtActionPoints.anchor.x = 0.5;
        this.addChild(this.txtActionPoints);
        for (let i = units.length - 1; i > -1; i--) {
            if (units[i].strength > 0) {
                const iconUnit = new druid.Rectangle(Field.CELL_SIZE.x, Field.CELL_SIZE.y, 0x444444);
                const spriteUnit: PIXI.Sprite = units[i].ship.createSprite();
                const factor: number = Math.min(1 / units[i].ship.hull.width, 1 / units[i].ship.hull.height);
                spriteUnit.scale.set(factor, factor);
                spriteUnit.anchor.set(0.5, 0.5);
                spriteUnit.position.set(iconUnit.width / 2, iconUnit.height / 2);
                iconUnit.addChild(spriteUnit);
                iconUnit.addChild(new druid.Frame(Field.CELL_SIZE.x, Field.CELL_SIZE.y, 1, units[i].frameColor));
                this.layoutQueue.addElement(iconUnit);

                units[i].on(Unit.DESTROY, () => {
                    this.layoutQueue.removeElement(iconUnit);
                    this.updateLayoutQueuePosition();
                });
            }
        }
        this.addChild(this.layoutQueue);

        unitService.on(ActionType.Move, () => this.updateActionPointsValue());
        unitService.on(ActionType.Shot, () => this.updateActionPointsValue());
        unitService.on(ActionType.NextTurn, () => {
            if (this.activeUnit) {
                this.layoutQueue.addElementAt(this.activeUnit, 0);
            }
            this.activeUnit = this.layoutQueue.getElementAt(this.layoutQueue.elementsCount - 1);
            this.layoutQueue.removeElement(this.activeUnit);
            this.updateActionPointsValue();
        });
    }

    setUpChildren(width: number, height: number) {
        this.freeHeight = height;
        this.txtActionPoints.x = width / 2;
        this.updateLayoutQueuePosition();
    }

    private updateActionPointsValue() {
        this.txtActionPoints.text = `${l("ap")}\n${this.unitService.activeUnit.actionPoints}`
            + `/${this.unitService.activeUnit.ship.hull.actionPoints}`;
    }

    private updateLayoutQueuePosition() {
        this.layoutQueue.pivot.y = this.layoutQueue.height;
        this.layoutQueue.y = this.freeHeight;
    }
}
