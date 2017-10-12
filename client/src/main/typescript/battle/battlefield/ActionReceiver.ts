import Controls from "./Controls";
import Field from "./Field";
import UnitService from "./unit/UnitService";
import { Action, getAction, ActionType, getMove, getShot } from "../request";
import { FINISH, MOVE, NEXT_TURN, SHOT } from "../util";
import * as game from "../../game";
import * as PIXI from "pixi.js";

export default class ActionService extends PIXI.utils.EventEmitter {

    private readonly longPoller;

    constructor(nextActionNumber: number, private readonly field: Field,
                private readonly controls: Controls, private readonly unitService: UnitService) {
        super();
        this.longPoller = new game.LongPoller<Action>(getAction, true, nextActionNumber);

        this.longPoller.on(game.LongPoller.NEXT_RESPONSE, (action: Action) => {
            this.field.removePathsAndMarksExceptCurrent();
            this.controls.lockInterface();
            if (action.type == ActionType.Move) {
                getMove(action.number, move => this.unitService.currentUnit.path = move);
            } else if (action.type == ActionType.Shot) {
                getShot(action.number, shot => {
                    this.unitService.currentUnit.shoot(this.unitService.units.filter(unit =>
                        unit.cell.x == shot.cell.x && unit.cell.y == shot.cell.y)[0], shot.gunId);
                });
            } else if (action.type == ActionType.NextTurn) {
                this.unitService.nextTurn();
            } else if (action.type == ActionType.Finish) {
                this.longPoller.isRunning = false;
                this.emit(FINISH);
            }
        });
        this.unitService.on(MOVE, () => this.longPoller.finishCurrentResponseProcessing());
        this.unitService.on(SHOT, () => this.longPoller.finishCurrentResponseProcessing());
        this.unitService.on(NEXT_TURN, () => this.longPoller.finishCurrentResponseProcessing());
    }
}
