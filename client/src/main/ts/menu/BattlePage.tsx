import StatusData from "./model/StatusData";
import BattleApp from "../battle/BattleApp";
import WebSocketClient from "../WebSocketClient";
import { Status } from "../model/util";
import { MenuComponent } from "./util";
import * as druid from "pixi-druid";
import * as mithril from "mithril";

export default class BattlePage extends MenuComponent {

    private battle: BattleApp;

    constructor(private readonly statusData: StatusData, private readonly webSocketClient: WebSocketClient) {
        super(mithril);
    }

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

    view(): mithril.Children {
        return <canvas id="battle" />;
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
