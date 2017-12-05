import Controls from "./Controls";
import Field from "./Field";
import UnitService from "./unit/UnitService";
import WebSocketConnection from "../WebSocketConnection";
import { ActionType, Move, Shot } from "../util";
import * as PIXI from "pixi.js";

export default class ActionReceiver extends PIXI.utils.EventEmitter {

    private isProcessingAction = false;
    private readonly remainingMoves = new Array<Move>(0);
    private readonly remainingShots = new Array<Shot>(0);
    private readonly remainingActions = new Array<ActionType>(0);

    constructor(private readonly field: Field, private readonly controls: Controls,
                private readonly unitService: UnitService, webSocketConnection: WebSocketConnection) {
        super();
        unitService.on(ActionType.Move, () => this.finishActionProcessing());
        unitService.on(ActionType.Shot, () => this.finishActionProcessing());
        unitService.on(ActionType.NextTurn, () => this.finishActionProcessing());
        webSocketConnection.on(ActionType.Move, (move: Move) => {
            this.remainingMoves.push(move);
            this.addAction(ActionType.Move);
        });
        webSocketConnection.on(ActionType.Shot, (shot: Shot) => {
            this.remainingShots.push(shot);
            this.addAction(ActionType.Shot);
        });
        webSocketConnection.on(ActionType.NextTurn, () => this.addAction(ActionType.NextTurn));
        webSocketConnection.on(ActionType.BattleFinish, () => this.addAction(ActionType.BattleFinish));
    }

    private addAction(actionType: ActionType) {
        if (this.isProcessingAction) {
            this.remainingActions.push(actionType);
        } else {
            this.processAction(actionType);
        }
    }

    private processAction(actionType: ActionType) {
        this.isProcessingAction = true;
        this.field.removePathsAndMarksExceptCurrent();
        this.controls.lockInterface();
        if (actionType == ActionType.Move) {
            this.unitService.currentUnit.currentMove = this.remainingMoves.shift();
        } else if (actionType == ActionType.Shot) {
            const shot: Shot = this.remainingShots.shift();
            this.unitService.currentUnit.shoot(this.unitService.units.filter(u =>
                u.cell.x == shot.cell.x && u.cell.y == shot.cell.y)[0], shot);
        } else if (actionType == ActionType.NextTurn) {
            this.unitService.nextTurn();
        } else if (actionType == ActionType.BattleFinish) {
            this.emit(ActionType.BattleFinish);
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
