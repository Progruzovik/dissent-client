import Ship from "./Ship";
import WebSocketClient from "../WebSocketClient";
import * as druid from "pixi-druid";
import * as PIXI from "pixi.js";

export default class Hangar extends PIXI.utils.EventEmitter {

    readonly ships: Ship[] = [];

    constructor(webSocketClient: WebSocketClient) {
        super();
        webSocketClient.requestShips(sd => {
            this.ships.length = 0;
            for (const data of sd) {
                this.ships.push(new Ship(data));
            }
            this.emit(druid.Event.UPDATE);
        });
    }
}
