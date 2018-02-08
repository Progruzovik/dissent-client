import { MenuComponent, HyperNode, CurrentScreen } from "./util";
import { l } from "../localizer";
import * as mithril from "mithril";

export default class Controls extends MenuComponent {

    currentScreen: CurrentScreen;

    constructor() {
        super(mithril);
    }

    view(): mithril.Children {
        const btnHangar: HyperNode = {
            attrs: {
                disabled: this.currentScreen == CurrentScreen.Hangar ? "disabled" : "",
                onclick: () => {
                    window.location.href = "#!/hangar/"
                }
            }
        };
        const btnMissions: HyperNode = {
            attrs: {
                disabled: this.currentScreen == CurrentScreen.Missions ? "disabled" : "",
                onclick: () => {
                    window.location.href = "#!/missions/"
                }
            }
        };
        const btnPvp: HyperNode = {
            attrs: {
                disabled: this.currentScreen == CurrentScreen.Pvp ? "disabled" : "",
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
