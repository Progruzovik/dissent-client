import { Controls } from "./ui/Controls";
import { Field } from "./ui/Field";
import { UnitService } from "./unit/UnitService";
import { WebSocketClient } from "../../WebSocketClient";
import { ActionType, Move, Shot } from "../../model/util";
import * as PIXI from "pixi.js";

export class ActionReceiver extends PIXI.utils.EventEmitter {

    private isProcessingAction = false;
    private readonly remainingMoves: Move[] = [];
    private readonly remainingShots: Shot[] = [];
    private readonly remainingActions: ActionType[] = [];

    constructor(private readonly field: Field, private readonly controls: Controls,
                private readonly unitService: UnitService, private readonly webSocketClient: WebSocketClient) {
        super();
        unitService.on(ActionType.Move, () => this.finishActionProcessing());
        unitService.on(ActionType.Shot, () => this.finishActionProcessing());
        unitService.on(ActionType.NextTurn, () => this.finishActionProcessing());
        webSocketClient.on(ActionType.Move, (move: Move) => {
            this.remainingMoves.push(move);
            this.addAction(ActionType.Move);
        });
        webSocketClient.on(ActionType.Shot, (shot: Shot) => {
            this.remainingShots.push(shot);
            this.addAction(ActionType.Shot);
        });
        webSocketClient.on(ActionType.NextTurn, () => this.addAction(ActionType.NextTurn));
        webSocketClient.on(ActionType.BattleFinish, () => this.addAction(ActionType.BattleFinish));
    }

    destroy() {
        this.webSocketClient.off(ActionType.Move);
        this.webSocketClient.off(ActionType.Shot);
        this.webSocketClient.off(ActionType.NextTurn);
        this.webSocketClient.off(ActionType.BattleFinish);
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
        this.controls.lockButtons();
        if (actionType == ActionType.Move) {
            this.unitService.activeUnit.currentMove = this.remainingMoves.shift();
        } else if (actionType == ActionType.Shot) {
            const shot: Shot = this.remainingShots.shift();
            this.unitService.activeUnit.shoot(this.unitService.findUnitOnCell(shot.cell), shot);
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
