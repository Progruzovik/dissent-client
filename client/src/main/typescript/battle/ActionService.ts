import { getActionsCount, getActions } from "./request";
import * as PIXI from "pixi.js";

export default class ActionService extends PIXI.utils.EventEmitter {

    private isProcessingRequests = false;
    private framesCount = 0;
    private actionsCount = 0;

    constructor() {
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
                            console.log(this.actionsCount);
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
