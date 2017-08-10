import Unit from "./Unit";
import * as game from "../../game";

export default class UnitManager extends PIXI.utils.EventEmitter {

    static readonly NEXT_TURN = "nextTurn";

    private readonly destroyedUnits = new Array<Unit>(0);

    constructor(readonly units: Unit[]) {
        super();
        this.currentUnit.makeCurrent();

        for (const unit of this.units) {
            unit.on(game.Event.MOUSE_OVER, () => {
                if (this.currentUnit.canHit(unit)) {
                    unit.alpha = 0.75;
                }
            });
            unit.on(game.Event.CLICK, () => {
                if (this.currentUnit.canHit(unit)) {
                    this.currentUnit.shoot(unit);
                }
            });
            unit.on(game.Event.MOUSE_OUT, () => {
                if (!unit.isDestroyed) {
                    unit.alpha = 1;
                }
            });
            unit.on(Unit.MOVE, (oldPosition: PIXI.Point, newPosition: PIXI.Point) =>
                this.emit(Unit.MOVE, oldPosition, newPosition));
            unit.on(Unit.PREPARED_TO_SHOT, () => this.emit(Unit.PREPARED_TO_SHOT, unit));
            unit.on(Unit.NOT_PREPARED_TO_SHOT, () => this.emit(Unit.NOT_PREPARED_TO_SHOT));
            unit.on(Unit.DESTROY, () => {
                this.units.splice(this.units.indexOf(unit), 1);
                this.destroyedUnits.push(unit);
                if (!this.units.some(activeUnit => unit.isLeft == activeUnit.isLeft)) {
                    this.emit(game.Event.FINISH);
                }
            });
        }
    }

    get currentUnit(): Unit {
        return this.units[0];
    }

    nextTurn() {
        if (this.currentUnit.preparedGun) {
            this.currentUnit.preparedGun = null;
        }
        this.units.push(this.units.shift());
        this.currentUnit.makeCurrent();
        this.emit(UnitManager.NEXT_TURN, this.currentUnit);
    }
}
