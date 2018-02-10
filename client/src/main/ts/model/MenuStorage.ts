import Ship from "./Ship";
import StatusStorage from "./StatusStorage";
import WebSocketClient from "../WebSocketClient";
import * as druid from "pixi-druid";
import * as PIXI from "pixi.js";

export default class MenuStorage extends PIXI.utils.EventEmitter {

    readonly ships: Ship[] = [];
    readonly missions: string[] = [];

    constructor(private readonly statusStorage: StatusStorage, private readonly webSocketClient: WebSocketClient) {
        super();
        this.updateData();
        this.statusStorage.on(StatusStorage.BATTLE_FINISH, () => this.updateData());
    }

    private updateData() {
        this.webSocketClient.requestShips(sd => {
            this.ships.length = 0;
            for (const data of sd) {
                this.ships.push(new Ship(data));
            }
            this.emit(druid.Event.UPDATE);
        });
        this.webSocketClient.requestMissions(m => {
            this.missions.length = 0;
            this.missions.push(...m);
            this.emit(druid.Event.UPDATE);
        });
    }
}