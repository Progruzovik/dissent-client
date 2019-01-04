import { Controls } from "./ui/Controls";
import { Field } from "./ui/Field";
import { UnitService } from "./unit/UnitService";
import { WebSocketClient } from "../../WebSocketClient";
import { MessageSubject, Move, Shot } from "../../model/util";
import * as PIXI from "pixi.js";

export class ActionReceiver extends PIXI.utils.EventEmitter {

    private isProcessingAction = false;
    private readonly remainingMoves: Move[] = [];
    private readonly remainingShots: Shot[] = [];
    private readonly remainingActions: MessageSubject[] = [];

    constructor(private readonly field: Field, private readonly controls: Controls,
                private readonly unitService: UnitService, private readonly webSocketClient: WebSocketClient) {
        super();
        unitService.on(MessageSubject.Move, () => this.finishActionProcessing());
        unitService.on(MessageSubject.Shot, () => this.finishActionProcessing());
        unitService.on(MessageSubject.NextTurn, () => this.finishActionProcessing());
        webSocketClient.on(MessageSubject.Move, (move: Move) => {
            this.remainingMoves.push(move);
            this.addAction(MessageSubject.Move);
        });
        webSocketClient.on(MessageSubject.Shot, (shot: Shot) => {
            this.remainingShots.push(shot);
            this.addAction(MessageSubject.Shot);
        });
        webSocketClient.on(MessageSubject.NextTurn, () => this.addAction(MessageSubject.NextTurn));
        webSocketClient.on(MessageSubject.BattleFinish, () => this.addAction(MessageSubject.BattleFinish));
    }

    destroy() {
        this.webSocketClient.off(MessageSubject.Move);
        this.webSocketClient.off(MessageSubject.Shot);
        this.webSocketClient.off(MessageSubject.NextTurn);
        this.webSocketClient.off(MessageSubject.BattleFinish);
    }

    private addAction(actionType: MessageSubject) {
        if (this.isProcessingAction) {
            this.remainingActions.push(actionType);
        } else {
            this.processAction(actionType);
        }
    }

    private processAction(actionType: MessageSubject) {
        this.isProcessingAction = true;
        this.field.removePathsAndMarksExceptCurrent();
        this.controls.lockButtons();
        if (actionType == MessageSubject.Move) {
            this.unitService.activeUnit.currentMove = this.remainingMoves.shift();
        } else if (actionType == MessageSubject.Shot) {
            const shot: Shot = this.remainingShots.shift();
            this.unitService.activeUnit.shoot(this.unitService.findUnitOnCell(shot.cell), shot);
        } else if (actionType == MessageSubject.NextTurn) {
            this.unitService.nextTurn();
        } else if (actionType == MessageSubject.BattleFinish) {
            this.emit(MessageSubject.BattleFinish);
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
