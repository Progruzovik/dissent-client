import Ship from "./Ship";
import WebSocketClient from "../WebSocketClient";
import { Status } from "./util";
import * as druid from "pixi-druid";
import * as PIXI from "pixi.js";

export default class Hangar extends PIXI.utils.EventEmitter {

    readonly ships: Ship[] = [];

    constructor(private readonly webSocketClient: WebSocketClient) {
        super();
        this.updateHangar();
        this.webSocketClient.on(WebSocketClient.STATUS, (status: Status) => {
            if (status == Status.Idle) {
                this.updateHangar();
            }
        });
    }

    private updateHangar() {
        this.webSocketClient.requestShips(sd => {
            this.ships.length = 0;
            for (const data of sd) {
                this.ships.push(new Ship(data));
            }
            this.emit(druid.Event.UPDATE);
        });
    }
}
