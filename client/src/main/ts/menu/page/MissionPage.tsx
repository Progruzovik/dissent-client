import Controls from "../Controls";
import WebSocketClient from "../../WebSocketClient";
import { CurrentScreen, HyperNode, MenuComponent } from "../util";
import { l } from "../../localizer";
import * as mithril from "mithril";

export default class MissionPage extends MenuComponent {

    private readonly missions: string[] = [];

    constructor(private readonly webSocketClient: WebSocketClient, private readonly controls: Controls) {
        super(mithril);
    }

    oninit() {
        this.webSocketClient.requestMissions(m => {
            this.missions.length = 0;
            this.missions.push(...m);
            mithril.redraw();
        });
        this.controls.currentScreen = CurrentScreen.Missions;
    }

    view(): mithril.Children {
        return (
            <div class="page flex flex-column">
                {this.missions.map((m, i) => {
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
