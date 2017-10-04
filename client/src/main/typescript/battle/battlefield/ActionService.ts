import Controls from "./Controls";
import Field from "./Field";
import UnitService from "./unit/UnitService";
import { Action, getActions, ActionType, getMove, getShot } from "../request";
import { FINISH, MOVE, NEXT_TURN, SHOT } from "../util";
import * as PIXI from "pixi.js";

export default class ActionService extends PIXI.utils.EventEmitter {

    private isRunning = true;
    private isPerformingRequest = false;
    private framesCount = 0;

    private remainingActions = new Array<Action>(0);

    constructor(private receivedActionsCount: number, private readonly field: Field,
                private readonly controls: Controls, private readonly unitService: UnitService) {
        super();

        PIXI.ticker.shared.add(() => {
            if (this.isRunning) {
                if (!this.isPerformingRequest) {
                    if (this.framesCount > 20) {
                        this.isPerformingRequest = true;
                        getActions(this.receivedActionsCount, actions => {
                            this.isPerformingRequest = false;
                            this.receivedActionsCount += actions.length;
                            this.remainingActions = this.remainingActions.concat(actions);
                        });
                        this.framesCount = 0;
                    }
                }
                if (this.remainingActions.length > 0) {
                    this.processNextAction();
                }
                this.framesCount++;
            }
        }, this);
        this.unitService.on(MOVE, () => this.isRunning = true);
        this.unitService.on(SHOT, () => this.isRunning = true);
        this.unitService.on(NEXT_TURN, () => this.isRunning = true);
    }

    private processNextAction() {
        this.isRunning = false;
        const action: Action = this.remainingActions.shift();
        this.field.isTurnActual = this.remainingActions.length == 0;
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
}
