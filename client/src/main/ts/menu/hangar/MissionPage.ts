import HangarData from "./model/HangarData";
import WebSocketClient from "../../WebSocketClient";
import { HyperNode } from "../util";
import { l } from "../../localizer";
import * as druid from "pixi-druid";
import * as m from "mithril";

export default class MissionPage implements m.ClassComponent {

    constructor(private readonly hangarData: HangarData, private readonly webSocketClient: WebSocketClient) {}

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
                        type: "button",
                        onclick: () => this.webSocketClient.startMission(i)
                    }
                };
                return m("button", btnMission.attrs, l(md));
            })
        );
    }
}
