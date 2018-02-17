import MenuData from "./model/MenuData";
import WebSocketClient from "../../WebSocketClient";
import { HyperNode, MenuComponent } from "../util";
import { l } from "../../localizer";
import * as druid from "pixi-druid";
import * as mithril from "mithril";

export default class MissionPage extends MenuComponent {

    constructor(private readonly menuData: MenuData, private readonly webSocketClient: WebSocketClient) {
        super(mithril);
    }

    oninit() {
        this.menuData.on(druid.Event.UPDATE, () => mithril.redraw());
    }

    onremove() {
        this.menuData.off(druid.Event.UPDATE);
    }

    view(): mithril.Children {
        return (
            <div class="page flex flex-column">
                {this.menuData.missions.map((m, i) => {
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
