import { HangarService } from "./service/HangarService";
import { WebSocketClient } from "../../WebSocketClient";
import { HyperNode } from "../util";
import { l } from "../../localizer";
import * as druid from "pixi-druid";
import * as m from "mithril";

export class MissionsPage implements m.ClassComponent {

    constructor(private readonly hangarService: HangarService, private readonly webSocketClient: WebSocketClient) {}

    oninit() {
        this.hangarService.on(druid.Event.UPDATE, () => m.redraw());
    }

    onremove() {
        this.hangarService.off(druid.Event.UPDATE);
    }

    view(): m.Children {
        return m(".page.flex.flex-column",
            this.hangarService.missions.map((md, i) => {
                const btnMission: HyperNode = {
                    attrs: {
                        onclick: () => this.webSocketClient.startMission(i)
                    }
                };
                return m("button[type=button]", btnMission.attrs, l(md));
            })
        );
    }
}
