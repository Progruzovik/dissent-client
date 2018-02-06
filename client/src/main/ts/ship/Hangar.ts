import WebSocketClient from "../WebSocketClient";
import { ShipData } from "../util";
import * as druid from "pixi-druid";
import * as PIXI from "pixi.js";

export default class Hangar extends PIXI.utils.EventEmitter {

    readonly ships = new Array<ShipData>(0);

    constructor(webSocketClient: WebSocketClient) {
        super();
        webSocketClient.requestShips(s => {
            this.ships.length = 0;
            this.ships.push(...s);
            this.emit(druid.Event.UPDATE);
        });
    }
}
