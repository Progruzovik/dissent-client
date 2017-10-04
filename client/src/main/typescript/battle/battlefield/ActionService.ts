import Controls from "./Controls";
import Field from "./Field";
import UnitService from "./unit/UnitService";
import { Action, getAction, ActionType, getMove, getShot } from "../request";
import { FINISH, MOVE, NEXT_TURN, SHOT } from "../util";
import * as PIXI from "pixi.js";

export default class ActionService extends PIXI.utils.EventEmitter {

    private isProcessingAction = false;
    private readonly remainingActions = new Array<Action>(0);

    constructor(private nextActionNumber: number, private readonly field: Field,
                private readonly controls: Controls, private readonly unitService: UnitService) {
        super();
        this.getNextAction();
        this.unitService.on(MOVE, () => this.finishProcessing());
        this.unitService.on(SHOT, () => this.finishProcessing());
        this.unitService.on(NEXT_TURN, () => this.finishProcessing());
    }

    private getNextAction() {
        getAction(this.nextActionNumber, action => {
            this.nextActionNumber++;
            this.remainingActions.push(action);
            if (!this.isProcessingAction) {
                this.processNextAction();
            }
            this.getNextAction();
        });
    }

    private processNextAction() {
        this.isProcessingAction = true;
        const action: Action = this.remainingActions.shift();
        this.field.removeMarksAndPath(true);
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
            this.emit(FINISH);
        }
    }

    private finishProcessing() {
        if (this.remainingActions.length == 0) {
            this.isProcessingAction = false;
        } else {
            this.processNextAction();
        }
    }
}
