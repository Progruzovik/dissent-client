import WebSocketClient from "../WebSocketClient";
import { Status } from "./util";
import * as druid from "pixi-druid";
import * as PIXI from "pixi.js";

export default class StatusStorage extends PIXI.utils.EventEmitter {

    static readonly BATTLE_FINISH = "battleFinish";

    private _currentStatus: Status;

    constructor(webSocketClient: WebSocketClient) {
        super();
        webSocketClient.on(WebSocketClient.STATUS, (status: Status) => {
            if (this.currentStatus != status) {
                if (this.currentStatus == Status.InBattle) {
                    this.emit(StatusStorage.BATTLE_FINISH);
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
