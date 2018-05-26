import { HangarService } from "./service/HangarService";
import { StatusService } from "../service/StatusService";
import { HyperNode } from "../util";
import { l } from "../../localizer";
import { Status } from "../../model/util";
import * as css from "../../../css/hangar.css";
import * as druid from "pixi-druid";
import * as m from "mithril";

export class HangarLayout implements m.ClassComponent {

    constructor(private readonly hangarData: HangarService, private readonly statusService: StatusService) {}

    oninit() {
        this.statusService.on(druid.Event.UPDATE, (status: Status) => {
            if (status == Status.InBattle) {
                m.route.set("/battle/");
            } else {
                m.redraw();
            }
        });
    }

    onremove() {
        this.statusService.off(druid.Event.UPDATE);
    }

    view(vnode: m.CVnode<any>): m.Children {
        const isNavigationDisabled: boolean = this.statusService.currentStatus == Status.Queued;
        const btnHangar: HyperNode = {
            attrs: {
                disabled: isNavigationDisabled || vnode.attrs.location == "hangar",
                onclick: () => m.route.set("/hangar/")
            }
        };
        const btnMissions: HyperNode = {
            attrs: {
                disabled: isNavigationDisabled || vnode.attrs.location == "missions",
                onclick: () => m.route.set("/missions/")
            }
        };
        const btnPvp: HyperNode = {
            attrs: {
                disabled: isNavigationDisabled || vnode.attrs.location == "queue",
                onclick: () => m.route.set("/queue/")
            }
        };

        const rightPanel: HyperNode = {
            attrs: {
                class: this.hangarData.rightPanelContent ? css.rightPanel : ""
            },
            children: this.hangarData.rightPanelContent
        };

        return m("",
            m(".light-grey.title.centered", m("i.title-text", "Dissent [tech demo]")),
            m(`.${css.grid}`,
                m(`.${css.content}`, vnode.children),
                m(`.${css.controls}.centered`,
                    m("button[type=button]", btnHangar.attrs, l("Hangar")),
                    m("button[type=button]", btnMissions.attrs, l("Missions")),
                    m("button[type=button]", btnPvp.attrs, l("PVP"))
                ),
                m("", rightPanel.attrs, rightPanel.children)
            )
        );
    }
}
