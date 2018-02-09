import BattleApp from "./battle/BattleApp";
import BattlePage from "./menu/page/BattlePage";
import HangarPage from "./menu/page/HangarPage";
import MissionPage from "./menu/page/MissionPage";
import ShipPage from "./menu/page/ShipPage";
import Controls from "./menu/Controls";
import Layout from "./menu/Layout";
import Hangar from "./model/Hangar";
import StatusStorage from "./model/StatusStorage";
import WebSocketClient from "./WebSocketClient";
import { Page } from "./menu/util";
import { initClient } from "./request";
import { updateLocalizedData } from "./localizer";
import * as mithril from "mithril";
import * as PIXI from "pixi.js";

document.title = "Dissent";
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
PIXI.utils.skipHello();
initClient("en", s => {
    updateLocalizedData(s);
    const webSocketClient = new WebSocketClient(`ws://${window.location.href.split("/")[2]}/app/`);
    if (document.body.className == "mithril") {
        const statusStorage = new StatusStorage(webSocketClient);
        const hangar = new Hangar(webSocketClient);
        const controls = new Controls();
        const layout = new Layout(controls);
        mithril.route(document.body, "/hangar/", {
            "/battle/": new BattlePage(webSocketClient),
            "/hangar/": new Page(layout, new HangarPage(hangar, controls)),
            "/hangar/ship/:id/": new Page(layout, new ShipPage(hangar, controls)),
            "/missions/": new Page(layout, new MissionPage(webSocketClient, controls))
        });

        statusStorage.on(StatusStorage.BATTLE_START, () => window.location.href = "#!/battle/");
        statusStorage.on(StatusStorage.BATTLE_FINISH, () => window.location.href = "#!/hangar/");
    } else {
        const resolution: number = window.devicePixelRatio || 1;
        const battle = new BattleApp(resolution, window.innerWidth, window.innerHeight, webSocketClient);
        document.body.appendChild(battle.view);

        window.onresize = () => battle.resize(window.innerWidth, window.innerHeight);
    }
});
