import Controls from "./Controls";
import { CurrentScreen, MenuComponent } from "./util";
import WebSocketClient from "../WebSocketClient";
import { l } from "../localizer";
import * as mithril from "mithril";

export default class MissionsScreen extends MenuComponent {

    private readonly missions: string[] = [];

    constructor(private readonly webSocketClient: WebSocketClient, private readonly controls: Controls) {
        super(mithril);
    }

    view(): mithril.Children {
        return (
            <div class="page flex flex-column">
                {this.missions.map(m => <button type="button">{l(m)}</button>)}
            </div>
        );
    }

    oninit() {
        this.webSocketClient.requestMissions(m => {
            this.missions.length = 0;
            this.missions.push(...m);
            mithril.redraw();
        });
        this.controls.currentScreen = CurrentScreen.Missions;
    }
}
