import Unit from "./unit/Unit";
import UnitService from "./unit/UnitService";
import { Side } from "./request";
import * as game from "../game";

export default class Queue extends game.Rectangle {

    constructor(playerSide: Side, unitService: UnitService) {
        super(0x000000, Unit.WIDTH);
        unitService.units.forEach((unit, i) => {
            const icon = new game.Rectangle(playerSide == unit.side ? 0x00FF00 : 0xFF0000,
                Unit.WIDTH, Unit.HEIGHT);
            icon.addChild(new PIXI.Sprite(unit.ship.texture));
            icon.y = Unit.HEIGHT * i;
            this.addChild(icon);

            unit.on(Unit.DESTROY, () => {
                this.removeChild(icon);
                this.updateChildrenPositions();
            });
        });

        unitService.on(UnitService.NEXT_TURN, (_, isFirst: boolean) => {
            if (!isFirst) {
                this.setChildIndex(this.getChildAt(0), this.children.length - 1);
                this.updateChildrenPositions();
            }
        });
    }

    private updateChildrenPositions() {
        this.children.forEach((child, i) => child.y = Unit.HEIGHT * i);
    }
}
