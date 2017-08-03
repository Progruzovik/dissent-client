import Unit from "./Unit";
import * as game from "../../game";

export default class UnitManager extends PIXI.utils.EventEmitter {

    static readonly NEXT_TURN = "nextTurn";

    private readonly destroyedUnits: Unit[] = [];

    constructor(readonly units: Unit[]) {
        super();
        this.currentUnit.makeCurrent();

        for (const unit of this.units) {
            unit.on(game.Event.MOUSE_OVER, () => {
                if (this.currentUnit.isPreparedToShot) {
                    unit.alpha = 0.75;
                }
            });
            unit.on(game.Event.CLICK, () => {
                if (this.currentUnit.isPreparedToShot) {
                    this.currentUnit.shoot(unit);
                }
            });
            unit.on(game.Event.MOUSE_OUT, () => {
                if (this.currentUnit.isPreparedToShot) {
                    unit.alpha = 1;
                }
            });
            unit.on(Unit.DESTROY, () => {
                this.units.splice(this.units.indexOf(unit), 1);
                this.destroyedUnits.push(unit);
                if (!this.units.some((activeUnit: Unit) => unit.isLeft == activeUnit.isLeft)) {
                    this.emit(game.Event.FINISH);
                }
            });
        }
    }

    get currentUnit(): Unit {
        return this.units[0];
    }

    findReachableUnitsForCurrent(): Unit[] {
        const result: Unit[] = this.units.filter((unit: Unit) => this.currentUnit.checkReachable(unit.col, unit.row));
        return result.concat(
            this.destroyedUnits.filter((unit: Unit) => this.currentUnit.checkReachable(unit.col, unit.row)));
    }

    nextTurn() {
        if (this.currentUnit.isPreparedToShot) {
            this.currentUnit.isPreparedToShot = false;
        }
        this.units.push(this.units.shift());
        this.currentUnit.makeCurrent();
        this.emit(UnitManager.NEXT_TURN, this.currentUnit);
    }
}
