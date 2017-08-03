import Mark from "./Mark";
import Unit from "../Unit";
import UnitManager from "../UnitManager";
import * as game from "../../game";

export default class MarkLayer extends PIXI.Container {

    private readonly currentMark = new Mark(0x00FF00);
    private readonly pathMarks: Mark[] = [];

    constructor(private readonly colsCount: number, private readonly rowsCount: number,
                private readonly unitManager: UnitManager) {
        super();
        this.addChild(this.currentMark);
        this.changeCurrentUnit(unitManager.currentUnit);
        unitManager.on(UnitManager.NEXT_TURN, (currentUnit: Unit) => this.changeCurrentUnit(currentUnit));
    }

    addPathMarks() {
        for (const mark of this.pathMarks) {
            this.addChild(mark);
        }
    }

    removeAllMarksExceptCurrent() {
        this.removeChildren();
        this.addChild(this.currentMark);
    }

    private changeCurrentUnit(unit: Unit) {
        this.removeAllMarksExceptCurrent();
        this.currentMark.setCell(unit.col, unit.row);

        const pathPoint = new game.Rectangle(15, 15, 0x00FF00);
        pathPoint.x = (Unit.WIDTH - pathPoint.width) / 2;
        pathPoint.y = (Unit.HEIGHT - pathPoint.height) / 2;

        const reachableUnits: Unit[] = this.unitManager.findReachableUnitsForCurrent();
        this.pathMarks.length = 0;
        for (let i = 0; i < unit.movementPoints; i++) {
            for (let j = 1; j <= unit.movementPoints - i; j++) {
                for (let k = 0; k < 4; k++) {
                    let markCol: number = unit.col, markRow: number = unit.row;
                    if (k == 0) {
                        markCol += j;
                        markRow += i;
                    } else if (k == 1) {
                        markCol -= i;
                        markRow += j;
                    } else if (k == 2) {
                        markCol -= j;
                        markRow -= i;
                    } else if (k == 3) {
                        markCol += i;
                        markRow -= j;
                    }

                    if (markCol > -1 && markCol < this.colsCount && markRow > -1 && markRow < this.rowsCount
                        && !reachableUnits.some((unit: Unit) => unit.col == markCol
                            && unit.row == markRow)) {
                        const pathMark = new Mark(0xFFFF00);
                        pathMark.setCell(markCol, markRow);
                        this.pathMarks.push(pathMark);

                        pathMark.on(game.Event.MOUSE_OVER, () => pathMark.addChild(pathPoint));
                        pathMark.on(game.Event.CLICK, () => {
                            unit.moveTo(markCol, markRow);
                            this.changeCurrentUnit(unit);
                            this.emit(game.Event.MOUSE_UP);
                        });
                        pathMark.on(game.Event.MOUSE_OUT, () => pathMark.removeChild(pathPoint));
                    }
                }
            }
        }
        this.addPathMarks();
    }
}
