import BattlePage from "./menu/page/BattlePage";
import HangarPage from "./menu/page/HangarPage";
import MissionPage from "./menu/page/MissionPage";
import PvpPage from "./menu/page/PvpPage";
import ShipPage from "./menu/page/ShipPage";
import Controls from "./menu/Controls";
import Layout from "./menu/Layout";
import MenuStorage from "./model/MenuStorage";
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
    const statusStorage = new StatusStorage(webSocketClient);
    const menuStorage = new MenuStorage(statusStorage, webSocketClient);
    const controls = new Controls(statusStorage);
    const layout = new Layout(controls);
    mithril.route(document.body, "/hangar/", {
        "/battle/": new BattlePage(statusStorage, webSocketClient),
        "/hangar/": new Page(layout, new HangarPage(menuStorage, controls)),
        "/hangar/ship/:id/": new Page(layout, new ShipPage(menuStorage, controls)),
        "/missions/": new Page(layout, new MissionPage(menuStorage, webSocketClient, controls)),
        "/pvp/": new Page(layout, new PvpPage(statusStorage, webSocketClient, controls))
    });
});
