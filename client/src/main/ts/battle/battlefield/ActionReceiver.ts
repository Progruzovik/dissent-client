import { Controls } from "./ui/Controls";
import { Field } from "./ui/Field";
import { UnitService } from "./unit/UnitService";
import { WebSocketClient } from "../../WebSocketClient";
import { Subject, Move, Shot } from "../../model/util";
import * as PIXI from "pixi.js";

export class ActionReceiver extends PIXI.utils.EventEmitter {

    private isProcessingAction = false;
    private readonly remainingMoves: Move[] = [];
    private readonly remainingShots: Shot[] = [];
    private readonly remainingActions: Subject[] = [];

    constructor(private readonly field: Field, private readonly controls: Controls,
                private readonly unitService: UnitService, private readonly webSocketClient: WebSocketClient) {
        super();
        unitService.on(Subject.Move, () => this.finishActionProcessing());
        unitService.on(Subject.Shot, () => this.finishActionProcessing());
        unitService.on(Subject.NextTurn, () => this.finishActionProcessing());
        webSocketClient.on(Subject.Move, (move: Move) => {
            this.remainingMoves.push(move);
            this.addAction(Subject.Move);
        });
        webSocketClient.on(Subject.Shot, (shot: Shot) => {
            this.remainingShots.push(shot);
            this.addAction(Subject.Shot);
        });
        webSocketClient.on(Subject.NextTurn, () => this.addAction(Subject.NextTurn));
        webSocketClient.on(Subject.BattleFinish, () => this.addAction(Subject.BattleFinish));
    }

    destroy() {
        this.webSocketClient.off(Subject.Move);
        this.webSocketClient.off(Subject.Shot);
        this.webSocketClient.off(Subject.NextTurn);
        this.webSocketClient.off(Subject.BattleFinish);
    }

    private addAction(actionType: Subject) {
        if (this.isProcessingAction) {
            this.remainingActions.push(actionType);
        } else {
            this.processAction(actionType);
        }
    }

    private processAction(actionType: Subject) {
        this.isProcessingAction = true;
        this.field.removePathsAndMarksExceptCurrent();
        this.controls.lockButtons();
        if (actionType == Subject.Move) {
            this.unitService.activeUnit.currentMove = this.remainingMoves.shift();
        } else if (actionType == Subject.Shot) {
            const shot: Shot = this.remainingShots.shift();
            this.unitService.activeUnit.shoot(this.unitService.findUnitOnCell(shot.cell), shot);
        } else if (actionType == Subject.NextTurn) {
            this.unitService.nextTurn();
        } else if (actionType == Subject.BattleFinish) {
            this.emit(Subject.BattleFinish);
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
