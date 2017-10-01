import { Action, getActionsCount, getActions } from "./request";
import * as PIXI from "pixi.js";

export default class ActionService extends PIXI.utils.EventEmitter {

    private isRunning = true;
    private isProcessingRequests = false;
    private framesCount = 0;

    private remainingActions = new Array<Action>(0);

    constructor(private receivedActionsCount: number) {
        super();

        PIXI.ticker.shared.add(() => {
            if (this.isRunning) {
                this.framesCount++;
                if (!this.isProcessingRequests) {
                    if (this.framesCount > 10) {
                        this.isProcessingRequests = true;
                        this.framesCount = 0;
                        getActionsCount(actionsCount => {
                            if (this.receivedActionsCount == actionsCount) {
                                this.isProcessingRequests = false;
                            } else {
                                getActions(this.receivedActionsCount, actions => {
                                    this.isProcessingRequests = false;
                                    this.receivedActionsCount = actionsCount;
                                    this.remainingActions = this.remainingActions.concat(actions);
                                });
                            }
                        });
                    }
                }
                if (this.remainingActions.length > 0) {
                    this.isRunning = false;
                    const action: Action = this.remainingActions.shift();
                    this.emit(action.type.toString(), action);
                }
            }
        }, this);
    }

    run() {
        this.isRunning = true;
    }
}
