import { StatusService } from "../service/StatusService";
import { WebSocketClient } from "../../WebSocketClient";
import { HyperNode } from "../util";
import { Status } from "../../model/util";
import { l } from "../../localizer";
import * as m from "mithril";

export class PvpPage implements m.ClassComponent {

    constructor(private readonly statusData: StatusService, private readonly webSocketClient: WebSocketClient) {}

    view(): m.Children {
        const btnPvp: HyperNode = {
            attrs: {
                type: "button",
                onclick: () => {
                    if (this.statusData.currentStatus == Status.Idle) {
                        this.webSocketClient.addToQueue();
                    } else if (this.statusData.currentStatus == Status.Queued) {
                        this.webSocketClient.removeFromQueue();
                    }
                }
            },
            children: this.statusData.currentStatus == Status.Idle ? l("EnterQueue") : l("LeaveQueue")
        };
        return m(".page.flex.flex-column", m("button", btnPvp.attrs, btnPvp.children));
    }
}
