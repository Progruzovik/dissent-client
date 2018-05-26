import { StatusService } from "./service/StatusService";
import { BattleApp } from "../battle/BattleApp";
import { WebSocketClient } from "../WebSocketClient";
import * as druid from "pixi-druid";
import * as m from "mithril";

export class BattlePage implements m.ClassComponent {

    private battle: BattleApp;

    constructor(private readonly statusService: StatusService, private readonly webSocketClient: WebSocketClient) {}

    oninit() {
        this.statusService.on(StatusService.BATTLE_FINISH, () => m.route.set("/hangar/"));
    }

    oncreate() {
        const canvas = document.getElementById("battle") as HTMLCanvasElement;
        this.battle = new BattleApp(window.devicePixelRatio || 1,
            window.innerWidth, window.innerHeight, canvas, this.webSocketClient);
        window.onresize = () => this.battle.resize(window.innerWidth, window.innerHeight);
        this.battle.once(druid.Event.DONE, () => this.webSocketClient.requestStatus());
    }

    onremove() {
        if (this.battle) {
            this.battle.destroy();
            this.battle = null;
        }
        window.onresize = null;
        this.statusService.off(druid.Event.UPDATE);
    }

    view(): m.Children {
        return m("canvas#battle");
    }
}
