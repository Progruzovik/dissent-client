import WebSocketClient from "../WebSocketClient";
import { Status } from "./util";
import * as druid from "pixi-druid";
import * as PIXI from "pixi.js";

export default class StatusStorage extends PIXI.utils.EventEmitter {

    static readonly BATTLE_START = "battleStart";
    static readonly BATTLE_FINISH = "battleFinish";

    private _currentStatus: Status;

    constructor(webSocketClient: WebSocketClient) {
        super();
        webSocketClient.on(WebSocketClient.STATUS, (status: Status) => {
            const oldStatus: Status = this.currentStatus;
            this._currentStatus = status;
            if (oldStatus != this.currentStatus) {
                if (this.currentStatus == Status.InBattle) {
                    this.emit(StatusStorage.BATTLE_START);
                } else if (oldStatus == Status.InBattle) {
                    this.emit(StatusStorage.BATTLE_FINISH);
                }
            }
            this.emit(druid.Event.UPDATE, this.currentStatus);
        });
        webSocketClient.updateStatus();
    }

    get currentStatus(): Status {
        return this._currentStatus;
    }
}
