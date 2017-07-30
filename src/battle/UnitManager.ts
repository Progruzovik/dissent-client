import Unit from "./Unit";
import * as game from "../game";

export default class UnitManager extends PIXI.utils.EventEmitter {

    static readonly NEXT_TURN = "nextTurn";

    private currentUnit: Unit;
    private destroyedUnits: Unit[] = [];

    constructor(private readonly units: Unit[]) {
        super();
        for (const unit of this.units) {
            unit.on(game.Event.CLICK, () => {
                if (this.currentUnit.checkPreparedToShot()) {
                    this.currentUnit.shoot(unit);
                }
            });
            unit.on(Unit.DESTROY, () => {
                this.units.splice(this.units.indexOf(unit), 1);
                this.destroyedUnits.push(unit);
                if (this.units.filter((activeUnit: Unit) => unit.checkLeft() == activeUnit.checkLeft()).length == 0) {
                    this.emit(game.Event.FINISH);
                }
            });
        }
    }

    getCurrentUnit(): Unit {
        return this.currentUnit;
    }

    getUnits(): Unit[] {
        return this.units;
    }

    findReachableUnitsForCurrent(): Unit[] {
        const result: Unit[] = this.units.filter(
            (unit: Unit) => this.currentUnit.checkReachable(unit.getCol(), unit.getRow()));
        return result.concat(this.destroyedUnits.filter(
            (unit: Unit) => this.currentUnit.checkReachable(unit.getCol(), unit.getRow())));
    }

    nextTurn() {
        if (this.currentUnit) {
            if (this.currentUnit.checkPreparedToShot()) {
                this.currentUnit.setPreparedToShot(false);
            }
            this.units.push(this.currentUnit);
        }
        this.currentUnit = this.units.shift();
        this.emit(UnitManager.NEXT_TURN, this.currentUnit);
    }
}
