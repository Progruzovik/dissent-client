import { BattlePage } from "./menu/BattlePage";
import { IndexPage } from "./menu/hangar/IndexPage";
import { MissionsPage } from "./menu/hangar/MissionsPage";
import { QueuePage } from "./menu/hangar/QueuePage";
import { ShipPage } from "./menu/hangar/ShipPage";
import { HangarLayout } from "./menu/hangar/HangarLayout";
import { HangarService } from "./menu/hangar/service/HangarService";
import { StatusService } from "./menu/service/StatusService";
import { Status } from "./model/util";
import { WebSocketClient } from "./WebSocketClient";
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
    const hangarService = new HangarService(statusService, webSocketClient);
    const hangarLayout = new HangarLayout(hangarService, statusService);
    const missionsPage = new MissionsPage(hangarService, webSocketClient);
    m.route(document.body, "/hangar/", {
        "/battle/": new DissentResolver(statusService, new BattlePage(statusService, webSocketClient)),
        "/hangar/": new PageWrapper(statusService, hangarLayout, new IndexPage(hangarService), "hangar"),
        "/hangar/ship/:id/": new PageWrapper(statusService, hangarLayout, new ShipPage(hangarService), "hangar"),
        "/missions/": new PageWrapper(statusService, hangarLayout, missionsPage, "missions"),
        "/queue/": new PageWrapper(statusService, hangarLayout, new QueuePage(statusService, webSocketClient), "queue")
    });
});

class DissentResolver implements m.RouteResolver {

    constructor(private readonly statusService: StatusService, private readonly page: m.ClassComponent) {}

    onmatch(args: any, path: string): void | m.ClassComponent {
        if (this.statusService.currentStatus == Status.Queued && path != "/queue/") {
            m.route.set("/queue/");
        } else if (this.statusService.currentStatus == Status.InBattle && path != "/battle/") {
            m.route.set("/battle/");
        } else if (this.statusService.currentStatus != Status.InBattle && path == "/battle/") {
            m.route.set("/hangar/");
        } else {
            return this.page;
        }
    }
}

class PageWrapper extends DissentResolver {

    constructor(statusService: StatusService, private readonly layout: m.ClassComponent,
                page: m.ClassComponent, private readonly location: string) {
        super(statusService, page);
    }

    render(vnode: m.CVnode<any>): m.Children {
        vnode.attrs.location = this.location;
        return m(this.layout, vnode.attrs, vnode);
    }
}
