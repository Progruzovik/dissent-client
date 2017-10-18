import Controls from "./Controls";
import Field from "./Field";
import UnitService from "./unit/UnitService";
import WebSocketConnection from "../WebSocketConnection";
import { getMove, getShot } from "../request";
import { Action, ActionType, FINISH, MOVE, NEXT_TURN, SHOT } from "../util";
import * as PIXI from "pixi.js";

export default class ActionReceiver extends PIXI.utils.EventEmitter {

    private isProcessingAction = false;
    private readonly remainingActions = new Array<Action>(0);

    constructor(actionsCount: number, private readonly webSocketConnection: WebSocketConnection,
                private readonly field: Field, private readonly controls: Controls,
                private readonly unitService: UnitService) {
        super();
        webSocketConnection.on(WebSocketConnection.ACTION, (action: Action) => {
            if (this.isProcessingAction) {
                this.remainingActions.push(action);
            } else {
                this.processAction(action);
            }
        });
        unitService.on(MOVE, () => this.finishActionProcessing());
        unitService.on(SHOT, () => this.finishActionProcessing());
        unitService.on(NEXT_TURN, () => this.finishActionProcessing());
    }

    private processAction(action: Action) {
        this.isProcessingAction = true;
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
            this.emit(FINISH);
        }
    }

    private finishActionProcessing() {
        if (this.remainingActions.length == 0) {
            this.isProcessingAction = false;
        } else {
            this.processAction(this.remainingActions.shift())
        }
    }
}
