import StatusStorage from "../model/StatusStorage";
import { MenuComponent, HyperNode, CurrentScreen } from "./util";
import { Status } from "../model/util";
import { l } from "../localizer";
import * as mithril from "mithril";
import * as druid from "pixi-druid";

export default class Controls extends MenuComponent {

    currentScreen: CurrentScreen;

    constructor(private readonly statusStorage: StatusStorage) {
        super(mithril);
    }

    oninit() {
        console.log("aaa");
        this.statusStorage.on(druid.Event.UPDATE, () => mithril.redraw());
    }

    onremove() {
        this.statusStorage.off(druid.Event.UPDATE);
    }

    view(): mithril.Children {
        if (this.statusStorage.currentStatus == Status.InBattle) {
            window.location.href = "#!/battle/";
        }

        const isDisabled: boolean = this.statusStorage.currentStatus == Status.Queued;
        const btnHangar: HyperNode = {
            attrs: {
                disabled: isDisabled || this.currentScreen == CurrentScreen.Hangar ? "disabled" : "",
                onclick: () => {
                    window.location.href = "#!/hangar/"
                }
            }
        };
        const btnMissions: HyperNode = {
            attrs: {
                disabled: isDisabled || this.currentScreen == CurrentScreen.Missions ? "disabled" : "",
                onclick: () => {
                    window.location.href = "#!/missions/"
                }
            }
        };
        const btnPvp: HyperNode = {
            attrs: {
                disabled: isDisabled || this.currentScreen == CurrentScreen.Pvp ? "disabled" : "",
                onclick: () => {
                    window.location.href = "#!/pvp/"
                }
            }
        };
        return (
            <div class="controls u-centered">
                <button type="button" {...btnHangar.attrs}>{l("hangar")}</button>
                <button type="button" {...btnMissions.attrs}>{l("missions")}</button>
                <button type="button" {...btnPvp.attrs}>{l("pvp")}</button>
            </div>
        );
    }
}
