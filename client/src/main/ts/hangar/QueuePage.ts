import { StatusService } from "../service/StatusService";
import { WebSocketClient } from "../WebSocketClient";
import { HyperNode } from "../util";
import { Status } from "../model/util";
import { l } from "../localizer";
import * as m from "mithril";

export class QueuePage implements m.ClassComponent {

    constructor(private readonly statusService: StatusService, private readonly webSocketClient: WebSocketClient) {}

    view(): m.Children {
        const btnPvp: HyperNode = {
            attrs: {
                onclick: () => {
                    if (this.statusService.currentStatus == Status.Idle) {
                        this.webSocketClient.addToQueue();
                    } else if (this.statusService.currentStatus == Status.Queued) {
                        this.webSocketClient.removeFromQueue();
                    }
                }
            },
            children: this.statusService.currentStatus == Status.Idle ? l("EnterQueue") : l("LeaveQueue")
        };
        return m(".page.flex.flex-column", m("button[type=button]", btnPvp.attrs, btnPvp.children));
    }
}
