import Unit from "./unit/Unit";
import UnitService from "./unit/UnitService";
import { ActionType, Side } from "../util";
import * as game from "../../game";

export default class Queue extends game.UiElement {

    private readonly bg = new game.Rectangle(0x000000, Unit.WIDTH);

    constructor(currentPlayerSide: Side, unitService: UnitService) {
        super();
        this.addChild(this.bg);
        unitService.units.forEach((unit, i) => {
            const unitIcon = new game.Rectangle(currentPlayerSide == unit.side ? 0x00FF00 : 0xFF0000,
                Unit.WIDTH, Unit.HEIGHT);
            unitIcon.addChild(new PIXI.Sprite(PIXI.loader.resources[unit.hull.texture.name].texture));
            unitIcon.y = Unit.HEIGHT * i;
            this.bg.addChild(unitIcon);

            unit.on(Unit.DESTROY, () => {
                this.bg.removeChild(unitIcon);
                this.updateChildrenPositions();
            });
        });

        unitService.on(ActionType.NextTurn, (isFirst: boolean) => {
            if (!isFirst) {
                this.bg.setChildIndex(this.bg.getChildAt(0), this.bg.children.length - 1);
                this.updateChildrenPositions();
            }
        });
    }

    resize(width: number, height: number) {
        this.bg.height = height;
    }

    private updateChildrenPositions() {
        this.bg.children.forEach((child, i) => child.y = Unit.HEIGHT * i);
    }
}
