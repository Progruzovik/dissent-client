import StatusData from "../model/StatusData";
import WebSocketClient from "../../WebSocketClient";
import { HyperNode, MenuComponent } from "../util";
import { Status } from "../../model/util";
import { l } from "../../localizer";
import * as mithril from "mithril";

export default class PvpPage extends MenuComponent {

    constructor(private readonly statusData: StatusData, private readonly webSocketClient: WebSocketClient) {
        super(mithril);
    }

    view(): mithril.Children {
        const btnPvp: HyperNode = {
            attrs: {
                onclick: () => {
                    if (this.statusData.currentStatus == Status.Idle) {
                        this.webSocketClient.addToQueue();
                    } else if (this.statusData.currentStatus == Status.Queued) {
                        this.webSocketClient.removeFromQueue();
                    }
                }
            },
            children: this.statusData.currentStatus == Status.Idle ? l("enterQueue") : l("leaveQueue")
        };
        return (
            <div class="page flex flex-column">
                <button type="button" {...btnPvp.attrs}>{btnPvp.children}</button>
            </div>
        );
    }
}
