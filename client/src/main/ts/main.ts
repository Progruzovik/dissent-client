import BattlePage from "./menu/BattlePage";
import IndexPage from "./menu/hangar/IndexPage";
import MissionPage from "./menu/hangar/MissionPage";
import PvpPage from "./menu/hangar/PvpPage";
import ShipPage from "./menu/hangar/ShipPage";
import Layout from "./menu/Layout";
import HangarData from "./menu/hangar/model/HangarData";
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
    const hangarData = new HangarData(statusData, webSocketClient);
    const layout = new Layout(hangarData, statusData);
    mithril.route(document.body, "/hangar/", {
        "/battle/": new BattlePage(statusData, webSocketClient),
        "/hangar/": new PageWrapper(layout, new IndexPage(hangarData)),
        "/hangar/ship/:id/": new PageWrapper(layout, new ShipPage(hangarData)),
        "/missions/": new PageWrapper(layout, new MissionPage(hangarData, webSocketClient)),
        "/pvp/": new PageWrapper(layout, new PvpPage(statusData, webSocketClient))
    });
});
