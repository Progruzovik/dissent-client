import MenuStorage from "./model/MenuStorage";
import StatusStorage from "./model/StatusStorage";
import { HyperNode, MenuComponent } from "./util";
import { l } from "../localizer";
import { Status } from "../model/util";
import * as druid from "pixi-druid";
import * as mithril from "mithril";

export default class Layout extends MenuComponent {

    constructor(private readonly menuStorage: MenuStorage, private readonly statusStorage: StatusStorage) {
        super(mithril);
    }

    oninit() {
        this.statusStorage.on(druid.Event.UPDATE, () => mithril.redraw());
    }

    onremove() {
        this.statusStorage.off(druid.Event.UPDATE);
    }

    view(vnode: mithril.CVnode): mithril.Children {
        if (this.statusStorage.currentStatus == Status.InBattle) {
            window.location.href = "#!/battle/";
            return null;
        }

        const isDisabled: boolean = this.statusStorage.currentStatus == Status.Queued;
        const location: string = window.location.href;
        const btnHangar: HyperNode = {
            attrs: {
                disabled: isDisabled || location.indexOf("hangar") != -1 ? "disabled" : "",
                onclick: () => {
                    window.location.href = "#!/hangar/"
                }
            }
        };
        const btnMissions: HyperNode = {
            attrs: {
                disabled: isDisabled || location.indexOf("missions") != -1 ? "disabled" : "",
                onclick: () => {
                    window.location.href = "#!/missions/"
                }
            }
        };
        const btnPvp: HyperNode = {
            attrs: {
                disabled: isDisabled || location.indexOf("pvp") != -1 ? "disabled" : "",
                onclick: () => {
                    window.location.href = "#!/pvp/"
                }
            }
        };

        const rightPanel: HyperNode = {
            attrs: {
                class: this.menuStorage.rightPanelContent ? "right-panel" : ""
            },
            children: this.menuStorage.rightPanelContent
        };

        return (
            <div>
                <div class="light-grey title u-centered">
                    <i class="title-text">Dissent [tech demo]</i>
                </div>
                <div class="main-menu">
                    <div class="content">{vnode.children}</div>
                    <div class="controls u-centered">
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
