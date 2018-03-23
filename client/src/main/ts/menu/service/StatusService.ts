import WebSocketClient from "../../WebSocketClient";
import { Status } from "../../model/util";
import * as druid from "pixi-druid";
import * as PIXI from "pixi.js";

export class StatusService extends PIXI.utils.EventEmitter {

    static readonly BATTLE_FINISH = "battleFinish";

    private _currentStatus: Status;

    constructor(webSocketClient: WebSocketClient) {
        super();
        webSocketClient.on(WebSocketClient.STATUS, (status: Status) => {
            if (this.currentStatus != status) {
                if (this.currentStatus == Status.InBattle) {
                    this.emit(StatusService.BATTLE_FINISH);
                }
                this._currentStatus = status;
                this.emit(druid.Event.UPDATE);
            }
        });
        webSocketClient.updateStatus();
    }

    get currentStatus(): Status {
        return this._currentStatus;
    }
}
