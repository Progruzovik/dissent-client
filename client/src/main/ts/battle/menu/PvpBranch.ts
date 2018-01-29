import WebSocketClient from "../WebSocketClient";
import { Status } from "../util";
import { l } from "../../localizer";
import * as druid from "pixi-druid";

export default class PvpBranch extends druid.AbstractBranch {

    private _status: Status;
    private readonly btnQueue = new druid.ToggleButton();

    constructor(webSocketClient: WebSocketClient) {
        super();
        this.btnQueue.pivot.set(this.btnQueue.width / 2, this.btnQueue.height / 2);
        this.addChild(this.btnQueue);

        this.btnQueue.on(druid.ToggleButton.TOGGLE, (isToggled: boolean) => {
            if (isToggled) {
                webSocketClient.addToQueue();
            } else {
                webSocketClient.removeFromQueue();
            }
        });
    }

    get status(): Status {
        return this._status;
    }

    set status(value: Status) {
        this._status = value;
        if (value == Status.Idle) {
            this.btnQueue.isToggled = false;
            this.btnQueue.text = l("enterQueue");
        } else if (value == Status.Queued) {
            this.btnQueue.isToggled = true;
            this.btnQueue.text = l("leaveQueue");
        }
    }

    setUpChildren(width: number, height: number): void {
        this.btnQueue.position.set(width / 2, height / 2);
    }
}
