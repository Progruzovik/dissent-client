import BattlePage from "./menu/page/BattlePage";
import HangarPage from "./menu/page/HangarPage";
import MissionPage from "./menu/page/MissionPage";
import PvpPage from "./menu/page/PvpPage";
import ShipPage from "./menu/page/ShipPage";
import Layout from "./menu/Layout";
import MenuData from "./menu/model/MenuData";
import StatusData from "./menu/model/StatusData";
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
    const statusData = new StatusData(webSocketClient);
    const menuData = new MenuData(statusData, webSocketClient);
    const layout = new Layout(menuData, statusData);
    mithril.route(document.body, "/hangar/", {
        "/battle/": new BattlePage(statusData, webSocketClient),
        "/hangar/": new PageWrapper(layout, new HangarPage(menuData)),
        "/hangar/ship/:id/": new PageWrapper(layout, new ShipPage(menuData)),
        "/missions/": new PageWrapper(layout, new MissionPage(menuData, webSocketClient)),
        "/pvp/": new PageWrapper(layout, new PvpPage(statusData, webSocketClient))
    });
});
