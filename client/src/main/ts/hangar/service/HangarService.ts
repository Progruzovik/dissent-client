import { Ship } from "../../model/Ship";
import { StatusService } from "../../service/StatusService";
import { WebSocketClient } from "../../WebSocketClient";
import * as druid from "pixi-druid";
import * as PIXI from "pixi.js";
import * as m from "mithril";
import { Mission } from "../../model/util";

export class HangarService extends PIXI.utils.EventEmitter {

    readonly ships: Ship[] = [];
    readonly missions: Mission[] = [];

    private _rightPanelContent: m.Children;

    constructor(private readonly statusService: StatusService, private readonly webSocketClient: WebSocketClient) {
        super();
        this.updateData();
        this.statusService.on(StatusService.BATTLE_FINISH, () => this.updateData());
    }

    get rightPanelContent(): m.Children {
        return this._rightPanelContent;
    }

    set rightPanelContent(value: m.Children) {
        this._rightPanelContent = value;
        m.redraw();
    }

    private updateData() {
        Promise.all([
            this.webSocketClient.requestShips(),
            this.webSocketClient.requestMissions()
        ]).then(data => {
            this.ships.length = 0;
            for (const shipData of data[0]) {
                this.ships.push(new Ship(shipData));
            }
            this.missions.length = 0;
            this.missions.push(...data[1]);
            this.emit(druid.Event.UPDATE);
        });
    }
}
