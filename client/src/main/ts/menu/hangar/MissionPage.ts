import { HangarService } from "./service/HangarService";
import { WebSocketClient } from "../../WebSocketClient";
import { HyperNode } from "../util";
import { l } from "../../localizer";
import * as druid from "pixi-druid";
import * as m from "mithril";

export class MissionPage implements m.ClassComponent {

    constructor(private readonly hangarData: HangarService, private readonly webSocketClient: WebSocketClient) {}

    oninit() {
        this.hangarData.on(druid.Event.UPDATE, () => m.redraw());
    }

    onremove() {
        this.hangarData.off(druid.Event.UPDATE);
    }

    view(): m.Children {
        return m(".page.flex.flex-column",
            this.hangarData.missions.map((md, i) => {
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
