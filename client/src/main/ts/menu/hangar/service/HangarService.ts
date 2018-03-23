import Ship from "../../../model/Ship";
import { StatusService } from "../../service/StatusService";
import WebSocketClient from "../../../WebSocketClient";
import * as druid from "pixi-druid";
import * as PIXI from "pixi.js";
import * as m from "mithril";

export class HangarService extends PIXI.utils.EventEmitter {

    readonly ships: Ship[] = [];
    readonly missions: string[] = [];

    private _rightPanelContent: m.Children;

    constructor(private readonly statusData: StatusService, private readonly webSocketClient: WebSocketClient) {
        super();
        this.updateData();
        this.statusData.on(StatusService.BATTLE_FINISH, () => this.updateData());
    }

    get rightPanelContent(): m.Children {
        return this._rightPanelContent;
    }

    set rightPanelContent(value: m.Children) {
        this._rightPanelContent = value;
        m.redraw();
    }

    private updateData() {
        this.webSocketClient.requestShips(sd => {
            this.ships.length = 0;
            for (const data of sd) {
                this.ships.push(new Ship(data));
            }
            this.emit(druid.Event.UPDATE);
        });
        this.webSocketClient.requestMissions(md => {
            this.missions.length = 0;
            this.missions.push(...md);
            this.emit(druid.Event.UPDATE);
        });
    }
}
