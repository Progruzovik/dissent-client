import { StatusService } from "./service/StatusService";
import { BattleApp } from "../battle/BattleApp";
import { WebSocketClient } from "../WebSocketClient";
import { Status } from "../model/util";
import * as druid from "pixi-druid";
import * as m from "mithril";

export class BattlePage implements m.ClassComponent {

    private battle: BattleApp;

    constructor(private readonly statusData: StatusService, private readonly webSocketClient: WebSocketClient) {}

    oncreate() {
        if (this.checkPlayerInBattle()) {
            const canvas = document.getElementById("battle") as HTMLCanvasElement;
            this.battle = new BattleApp(window.devicePixelRatio || 1,
                window.innerWidth, window.innerHeight, canvas, this.webSocketClient);

            window.onresize = () => this.battle.resize(window.innerWidth, window.innerHeight);
            this.statusData.on(druid.Event.UPDATE, () => this.checkPlayerInBattle());
            this.battle.once(druid.Event.DONE, () => this.webSocketClient.updateStatus());
        }
    }

    onremove() {
        if (this.battle) {
            this.battle.destroy();
            this.battle = null;
        }

        window.onresize = null;
        this.statusData.off(druid.Event.UPDATE);
    }

    view(): m.Children {
        return m("canvas#battle");
    }

    private checkPlayerInBattle(): boolean {
        if (this.statusData.currentStatus == Status.InBattle) {
            return true;
        } else {
            window.location.href = "#/hangar/";
            return false;
        }
    }
}
