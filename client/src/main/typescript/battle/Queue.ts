import Unit from "./unit/Unit";
import UnitManager from "./unit/UnitManager";
import * as game from "../game";

export default class Queue extends game.Rectangle {

    constructor(isPlayerOnLeft: boolean, unitManager: UnitManager) {
        super(0x000000, Unit.WIDTH);
        unitManager.units.forEach((unit: Unit, i: number) => {
            const icon = new game.Rectangle(unit.isLeft == isPlayerOnLeft ? 0x00FF00 : 0xFF0000,
                Unit.WIDTH, Unit.HEIGHT);
            icon.addChild(new PIXI.Sprite(unit.ship.texture));
            icon.y = Unit.HEIGHT * i;
            this.addChild(icon);

            unit.on(Unit.DESTROY, () => {
                this.removeChild(icon);
                this.updateChildrenPositions();
            });
        });

        unitManager.on(UnitManager.NEXT_TURN, () => {
            this.setChildIndex(this.getChildAt(0), this.children.length - 1);
            this.updateChildrenPositions();
        });
    }

    private updateChildrenPositions() {
        this.children.forEach((child: PIXI.DisplayObject, i: number) => child.y = Unit.HEIGHT * i);
    }
}
