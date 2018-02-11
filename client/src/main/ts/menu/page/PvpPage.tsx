import StatusStorage from "../model/StatusStorage";
import WebSocketClient from "../../WebSocketClient";
import { HyperNode, MenuComponent } from "../util";
import { Status } from "../../model/util";
import { l } from "../../localizer";
import * as mithril from "mithril";

export default class PvpPage extends MenuComponent {

    constructor(private readonly statusStorage: StatusStorage, private readonly webSocketClient: WebSocketClient) {
        super(mithril);
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
