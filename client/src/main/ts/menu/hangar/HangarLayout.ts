import { HangarService } from "./service/HangarService";
import { StatusService } from "../service/StatusService";
import { HyperNode } from "../util";
import { l } from "../../localizer";
import { Status } from "../../model/util";
import * as css from "../../../css/hangar.css";
import * as druid from "pixi-druid";
import * as m from "mithril";

export class HangarLayout implements m.ClassComponent {

    constructor(private readonly hangarData: HangarService, private readonly statusData: StatusService) {}

    oninit() {
        this.statusData.on(druid.Event.UPDATE, () => m.redraw());
    }

    onremove() {
        this.statusData.off(druid.Event.UPDATE);
    }

    view(vnode: m.CVnode<any>): m.Children {
        if (this.statusData.currentStatus == Status.InBattle) {
            window.location.href = "#!/battle/";
            return null;
        }

        const isDisabled: boolean = this.statusData.currentStatus == Status.Queued;
        const btnHangar: HyperNode = {
            attrs: {
                disabled: isDisabled || vnode.attrs.location == "hangar",
                onclick: () => {
                    window.location.href = "#!/hangar/"
                }
            }
        };
        const btnMissions: HyperNode = {
            attrs: {
                disabled: isDisabled || vnode.attrs.location == "missions",
                onclick: () => {
                    window.location.href = "#!/missions/"
                }
            }
        };
        const btnPvp: HyperNode = {
            attrs: {
                disabled: isDisabled || vnode.attrs.location == "pvp",
                onclick: () => {
                    window.location.href = "#!/pvp/"
                }
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
