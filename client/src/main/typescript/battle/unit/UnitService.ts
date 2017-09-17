import Unit from "./Unit";
import * as game from "../../game";

export default class UnitService extends PIXI.utils.EventEmitter {

    static readonly NEXT_TURN = "nextTurn";

    private highlightedUnit: Unit = null;
    private readonly destroyedUnits = new Array<Unit>(0);

    constructor(readonly units: Unit[]) {
        super();
        this.currentUnit.makeCurrent();

        for (const unit of this.units) {
            unit.on(game.Event.MOUSE_OVER, () => {
                if (this.currentUnit.canHit(unit)) {
                    unit.alpha = 0.75;
                }
                this.highlightedUnit = unit;
            });
            unit.on(game.Event.CLICK, () => {
                if (unit == this.highlightedUnit && this.currentUnit.canHit(unit)) {
                    this.currentUnit.shoot(unit);
                }
            });
            unit.on(game.Event.MOUSE_OUT, () => {
                if (unit == this.highlightedUnit) {
                    if (!unit.isDestroyed) {
                        unit.alpha = 1;
                    }
                    this.highlightedUnit = null;
                }
            });
            unit.on(Unit.MOVE, (oldPosition: PIXI.Point, newPosition: PIXI.Point) =>
                this.emit(Unit.MOVE, oldPosition, newPosition));
            unit.on(Unit.PREPARED_TO_SHOT, () => this.emit(Unit.PREPARED_TO_SHOT, unit));
            unit.on(Unit.SHOT, () => this.emit(Unit.SHOT, unit));
            unit.on(Unit.NOT_PREPARED_TO_SHOT, () => {
                if (this.highlightedUnit) {
                    this.highlightedUnit.emit(game.Event.MOUSE_OUT);
                }
                this.emit(Unit.NOT_PREPARED_TO_SHOT);
            });
            unit.on(Unit.DESTROY, () => {
                this.units.splice(this.units.indexOf(unit), 1);
                this.destroyedUnits.push(unit);
                if (!this.units.some(activeUnit => unit.side == activeUnit.side)) {
                    this.emit(game.Event.DONE);
                }
            });
        }
    }

    get currentUnit(): Unit {
        return this.units[0];
    }

    nextTurn() {
        this.currentUnit.makeGunPrepared(null);
        this.units.push(this.units.shift());
        this.currentUnit.makeCurrent();
        this.emit(UnitService.NEXT_TURN, this.currentUnit, false);
    }
}
