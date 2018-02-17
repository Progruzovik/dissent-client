import BattlePage from "./page/BattlePage";
import IndexPage from "./page/menu/IndexPage";
import MissionPage from "./page/menu/MissionPage";
import PvpPage from "./page/menu/PvpPage";
import ShipPage from "./page/menu/ShipPage";
import Layout from "./page/Layout";
import MenuData from "./page/menu/model/MenuData";
import StatusData from "./page/model/StatusData";
import WebSocketClient from "./WebSocketClient";
import { PageWrapper } from "./page/util";
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
        "/hangar/": new PageWrapper(layout, new IndexPage(menuData)),
        "/hangar/ship/:id/": new PageWrapper(layout, new ShipPage(menuData)),
        "/missions/": new PageWrapper(layout, new MissionPage(menuData, webSocketClient)),
        "/pvp/": new PageWrapper(layout, new PvpPage(statusData, webSocketClient))
    });
});
