import Controls from "../Controls";
import MenuStorage from "../../model/MenuStorage";
import WebSocketClient from "../../WebSocketClient";
import { CurrentScreen, HyperNode, MenuComponent } from "../util";
import { l } from "../../localizer";
import * as druid from "pixi-druid";
import * as mithril from "mithril";

export default class MissionPage extends MenuComponent {

    constructor(private readonly menuStorage: MenuStorage,
                private readonly webSocketClient: WebSocketClient, private readonly controls: Controls) {
        super(mithril);
    }

    oninit() {
        this.controls.currentScreen = CurrentScreen.Missions;
        this.menuStorage.on(druid.Event.UPDATE, () => mithril.redraw());
    }

    onremove() {
        this.menuStorage.off(druid.Event.UPDATE);
    }

    view(): mithril.Children {
        return (
            <div class="page flex flex-column">
                {this.menuStorage.missions.map((m, i) => {
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
