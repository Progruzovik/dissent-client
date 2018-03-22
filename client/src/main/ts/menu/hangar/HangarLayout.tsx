import HangarData from "./model/HangarData";
import StatusData from "../model/StatusData";
import { HyperNode, MenuComponent } from "../util";
import { l } from "../../localizer";
import { Status } from "../../model/util";
import * as css from "../../../css/hangar.css";
import * as druid from "pixi-druid";
import * as mithril from "mithril";

export default class HangarLayout extends MenuComponent {

    constructor(private readonly hangarData: HangarData, private readonly statusData: StatusData) {
        super(mithril);
    }

    oninit() {
        this.statusData.on(druid.Event.UPDATE, () => mithril.redraw());
    }

    onremove() {
        this.statusData.off(druid.Event.UPDATE);
    }

    view(vnode: mithril.Vnode<any>): mithril.Children {
        if (this.statusData.currentStatus == Status.InBattle) {
            window.location.href = "#!/battle/";
            return null;
        }

        const isDisabled: boolean = this.statusData.currentStatus == Status.Queued;
        const btnHangar: HyperNode = {
            attrs: {
                disabled: isDisabled || vnode.attrs.location == "hangar" ? "disabled" : "",
                onclick: () => {
                    window.location.href = "#!/hangar/"
                }
            }
        };
        const btnMissions: HyperNode = {
            attrs: {
                disabled: isDisabled || vnode.attrs.location == "missions" ? "disabled" : "",
                onclick: () => {
                    window.location.href = "#!/missions/"
                }
            }
        };
        const btnPvp: HyperNode = {
            attrs: {
                disabled: isDisabled || vnode.attrs.location == "pvp" ? "disabled" : "",
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

        return (
            <div>
                <div class="light-grey title centered">
                    <i class="title-text">Dissent [tech demo]</i>
                </div>
                <div class={css.grid}>
                    <div class={css.content}>{vnode.children}</div>
                    <div class={`${css.controls} centered`}>
                        <button type="button" {...btnHangar.attrs}>{l("hangar")}</button>
                        <button type="button" {...btnMissions.attrs}>{l("missions")}</button>
                        <button type="button" {...btnPvp.attrs}>{l("pvp")}</button>
                    </div>
                    <div {...rightPanel.attrs}>{rightPanel.children}</div>
                </div>
            </div>
        );
    }
}
