import Controls from "../Controls";
import StatusStorage from "../../model/StatusStorage";
import WebSocketClient from "../../WebSocketClient";
import { CurrentScreen, HyperNode, MenuComponent } from "../util";
import { Status } from "../../model/util";
import { l } from "../../localizer";
import * as druid from "pixi-druid";
import * as mithril from "mithril";

export default class PvpPage extends MenuComponent {

    constructor(private readonly statusStorage: StatusStorage,
                private readonly webSocketClient: WebSocketClient, private readonly controls: Controls) {
        super(mithril);
    }

    oninit() {
        this.controls.currentScreen = CurrentScreen.Pvp;
    }

    view(): mithril.Children {
        const btnPvp: HyperNode = {
            attrs: {
                onclick: () => {
                    if (this.statusStorage.currentStatus == Status.Idle) {
                        this.webSocketClient.addToQueue();
                    } else if (this.statusStorage.currentStatus == Status.Queued) {
                        this.webSocketClient.removeFromQueue();
                    }
                }
            },
            children: this.statusStorage.currentStatus == Status.Idle ? l("enterQueue") : l("leaveQueue")
        };
        return (
            <div class="page flex flex-column">
                <button type="button" {...btnPvp.attrs}>{btnPvp.children}</button>
            </div>
        );
    }
}
