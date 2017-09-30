import { getActionsCount, getActions } from "./request";
import * as PIXI from "pixi.js";

export default class ActionService extends PIXI.utils.EventEmitter {

    private isProcessingRequests = false;
    private framesCount = 0;

    constructor(private actionsCount: number) {
        super();

        PIXI.ticker.shared.add(() => {
            this.framesCount++;
            if (!this.isProcessingRequests && this.framesCount > 10) {
                this.isProcessingRequests = true;
                this.framesCount = 0;
                getActionsCount(actionsCount => {
                    if (this.actionsCount == actionsCount) {
                        this.isProcessingRequests = false;
                    } else {
                        getActions(this.actionsCount, actions => {
                            this.isProcessingRequests = false;
                            this.actionsCount = actionsCount;
                            for (const action of actions) {
                                this.emit(action.type.toString(), action);
                            }
                        });
                    }
                });
            }
        }, this);
    }
}
