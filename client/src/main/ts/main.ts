import BattlePage from "./menu/page/BattlePage";
import HangarPage from "./menu/page/HangarPage";
import MissionPage from "./menu/page/MissionPage";
import PvpPage from "./menu/page/PvpPage";
import ShipPage from "./menu/page/ShipPage";
import Layout from "./menu/Layout";
import MenuStorage from "./menu/model/MenuStorage";
import StatusStorage from "./menu/model/StatusStorage";
import WebSocketClient from "./WebSocketClient";
import { PageWrapper } from "./menu/util";
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
    const layout = new Layout(menuStorage, statusStorage);
    mithril.route(document.body, "/hangar/", {
        "/battle/": new BattlePage(statusStorage, webSocketClient),
        "/hangar/": new PageWrapper(layout, new HangarPage(menuStorage)),
        "/hangar/ship/:id/": new PageWrapper(layout, new ShipPage(menuStorage)),
        "/missions/": new PageWrapper(layout, new MissionPage(menuStorage, webSocketClient)),
        "/pvp/": new PageWrapper(layout, new PvpPage(statusStorage, webSocketClient))
    });
});
