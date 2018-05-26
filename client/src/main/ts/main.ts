import { BattlePage } from "./menu/BattlePage";
import { IndexPage } from "./menu/hangar/IndexPage";
import { MissionsPage } from "./menu/hangar/MissionsPage";
import { QueuePage } from "./menu/hangar/QueuePage";
import { ShipPage } from "./menu/hangar/ShipPage";
import { HangarLayout } from "./menu/hangar/HangarLayout";
import { HangarService } from "./menu/hangar/service/HangarService";
import { StatusService } from "./menu/service/StatusService";
import { WebSocketClient } from "./WebSocketClient";
import { DissentResolver, PageWrapper } from "./menu/util";
import { getStrings, initClient } from "./request";
import { updateLocalizedData } from "./localizer";
import "skeleton-css/css/normalize.css";
import "skeleton-css/css/skeleton.css";
import "../css/global.css";
import * as m from "mithril";
import * as PIXI from "pixi.js";

document.title = "Dissent";
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
PIXI.utils.skipHello();

const url: string = window.location.origin.replace("http", "ws");
const webSocketClient = new WebSocketClient(`${url}/app/`);
const statusService = new StatusService(webSocketClient);
Promise.all([
    getStrings("en"),
    initClient(),
    statusService.reload()
]).then(data => {
    updateLocalizedData(data[0]);
    const hangarData = new HangarService(statusService, webSocketClient);
    const hangarLayout = new HangarLayout(hangarData, statusService);
    const missionsPage = new MissionsPage(hangarData, webSocketClient);
    m.route(document.body, "/hangar/", {
        "/battle/": new DissentResolver(statusService, new BattlePage(statusService, webSocketClient)),
        "/hangar/": new PageWrapper(statusService, hangarLayout, new IndexPage(hangarData), "hangar"),
        "/hangar/ship/:id/": new PageWrapper(statusService, hangarLayout, new ShipPage(hangarData), "hangar"),
        "/missions/": new PageWrapper(statusService, hangarLayout, missionsPage, "missions"),
        "/queue/": new PageWrapper(statusService, hangarLayout, new QueuePage(statusService, webSocketClient), "queue")
    });
});
