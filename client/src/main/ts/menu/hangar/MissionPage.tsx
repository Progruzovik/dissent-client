import HangarData from "./model/HangarData";
import WebSocketClient from "../../WebSocketClient";
import { HyperNode, MenuComponent } from "../util";
import { l } from "../../localizer";
import * as druid from "pixi-druid";
import * as mithril from "mithril";

export default class MissionPage extends MenuComponent {

    constructor(private readonly hangarData: HangarData, private readonly webSocketClient: WebSocketClient) {
        super(mithril);
    }

    oninit() {
        this.hangarData.on(druid.Event.UPDATE, () => mithril.redraw());
    }

    onremove() {
        this.hangarData.off(druid.Event.UPDATE);
    }

    view(): mithril.Children {
        return (
            <div class="page flex flex-column">
                {this.hangarData.missions.map((m, i) => {
                    const btnMission: HyperNode = {
                        attrs: {
                            onclick: () => this.webSocketClient.startMission(i)
                        }
                    };
                    return (
                        <button type="button" {...btnMission.attrs}>{l(m)}</button>
                    );
                })}
            </div>
        );
    }
}
