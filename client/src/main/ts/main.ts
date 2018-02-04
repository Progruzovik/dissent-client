import BattleApp from "./Battle/BattleApp";
import Hangar from "./Hangar";
import WebSocketClient from "./WebSocketClient";
import { initClient } from "./battle/request";
import { updateLocalizedData } from "./localizer";
import * as m from "mithril";
import * as PIXI from "pixi.js";

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
PIXI.utils.skipHello();
initClient("en", s => {
    updateLocalizedData(s);
    const webSocketClient = new WebSocketClient(`ws://${window.location.href.split("/")[2]}/app/`);
    if (document.body.className == "mithril") {
        m.route(document.body, "/hangar/", {
            "/hangar/": new Hangar(webSocketClient)
        });
    } else {
        const resolution: number = window.devicePixelRatio || 1;
        const battle = new BattleApp(resolution, window.innerWidth, window.innerHeight, webSocketClient);
        document.body.appendChild(battle.view);

        window.onresize = () => battle.resize(window.innerWidth, window.innerHeight);
    }
});
