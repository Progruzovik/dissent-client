import StatusStorage from "../../model/StatusStorage";
import BattleApp from "../../battle/BattleApp";
import WebSocketClient from "../../WebSocketClient";
import { Status } from "../../model/util";
import { MenuComponent } from "../util";
import * as druid from "pixi-druid";
import * as mithril from "mithril";

export default class BattlePage extends MenuComponent {

    private battle: BattleApp;

    constructor(private readonly statusStorage: StatusStorage, private readonly webSocketClient: WebSocketClient) {
        super(mithril);
    }

    oninit() {
        if (this.checkPlayerInBattle()) {
            const resolution: number = window.devicePixelRatio || 1;
            this.battle = new BattleApp(resolution, window.innerWidth, window.innerHeight, this.webSocketClient);

            window.onresize = () => this.battle.resize(window.innerWidth, window.innerHeight);
            this.statusStorage.on(druid.Event.UPDATE, (status: Status) => this.checkPlayerInBattle());
        }
    }

    oncreate() {
        if (this.battle) {
            document.body.appendChild(this.battle.view);
        }
    }

    onremove() {
        if (this.battle) {
            document.body.removeChild(this.battle.view);
            this.battle.destroy();
            this.battle = null;
        }

        window.onresize = null;
        this.statusStorage.off(druid.Event.UPDATE);
    }

    view(): mithril.Children {
        return null;
    }

    private checkPlayerInBattle(): boolean {
        if (this.statusStorage.currentStatus == Status.InBattle) {
            return true;
        } else {
            window.location.href = "#/hangar/";
            return false;
        }
    }
}
