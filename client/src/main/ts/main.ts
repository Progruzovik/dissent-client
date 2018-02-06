import BattleApp from "./Battle/BattleApp";
import Controls from "./menu/Controls";
import HangarScreen from "./menu/HangarScreen";
import Layout from "./menu/Layout";
import MissionsScreen from "./menu/MissionsScreen";
import ShipScreen from "./menu/ShipScreen";
import Hangar from "./ship/Hangar";
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
        const hangar = new Hangar(webSocketClient);
        const controls = new Controls();
        const layout = new Layout(controls);
        mithril.route(document.body, "/hangar/", {
            "/hangar/": new Page(layout, new HangarScreen(hangar, controls)),
            "/hangar/ship/:id/": new Page(layout, new ShipScreen(hangar, controls)),
            "/missions/": new Page(layout, new MissionsScreen(webSocketClient, controls))
        });
    } else {
        const resolution: number = window.devicePixelRatio || 1;
        const battle = new BattleApp(resolution, window.innerWidth, window.innerHeight, webSocketClient);
        document.body.appendChild(battle.view);

        window.onresize = () => battle.resize(window.innerWidth, window.innerHeight);
    }
});
