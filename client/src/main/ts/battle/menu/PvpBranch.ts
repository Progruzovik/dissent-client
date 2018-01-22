import WebSocketClient from "../WebSocketClient";
import { Status } from "../util";
import { l } from "../../localizer";
import * as druid from "pixi-druid";

export default class PvpBranch extends druid.AbstractBranch {

    private _status: Status;
    private readonly btnQueue = new druid.Button();

    constructor(webSocketClient: WebSocketClient) {
        super();
        this.btnQueue.pivot.set(this.btnQueue.width / 2, this.btnQueue.height / 2);
        this.addChild(this.btnQueue);

        this.btnQueue.on(druid.Button.TRIGGERED, () => {
            if (this.status == Status.Queued) {
                webSocketClient.removeFromQueue();
            } else {
                webSocketClient.addToQueue();
            }
        });
    }

    get status(): Status {
        return this._status;
    }

    set status(value: Status) {
        this._status = value;
        if (value == Status.Idle) {
            this.btnQueue.text = l("enterQueue");
        } else if (value == Status.Queued) {
            this.btnQueue.text = l("leaveQueue");
        }
    }

    setUpChildren(width: number, height: number): void {
        this.btnQueue.position.set(width / 2, height / 2);
    }
}
