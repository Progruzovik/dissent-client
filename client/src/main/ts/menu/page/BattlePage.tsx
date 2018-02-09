import BattleApp from "../../battle/BattleApp";
import WebSocketClient from "../../WebSocketClient";
import { MenuComponent } from "../util";
import * as mithril from "mithril";

export default class BattlePage extends MenuComponent {

    private battle: BattleApp;

    constructor(private readonly webSocketClient: WebSocketClient) {
        super(mithril);
    }

    view(): mithril.Children {
        return null;
    }

    oninit() {
        const resolution: number = window.devicePixelRatio || 1;
        this.battle = new BattleApp(resolution, window.innerWidth, window.innerHeight, this.webSocketClient);
        window.onresize = () => this.battle.resize(window.innerWidth, window.innerHeight);
    }

    oncreate() {
        document.body.appendChild(this.battle.view);
    }

    onremove() {
        document.body.removeChild(this.battle.view);
        this.battle = null;
        window.onresize = null;
    }
}
