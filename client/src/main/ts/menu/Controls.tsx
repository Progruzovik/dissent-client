import { MenuComponent, HyperNode, CurrentScreen } from "./util";
import { l } from "../localizer";
import * as mithril from "mithril";

export default class Controls extends MenuComponent {

    private _currentScreen: CurrentScreen;

    constructor() {
        super(mithril);
    }

    get currentScreen(): CurrentScreen {
        return this._currentScreen;
    }

    set currentScreen(value: CurrentScreen) {
        this._currentScreen = value;
        mithril.redraw();
    }

    view(): mithril.Children {
        const btnHangar: HyperNode = {
            attrs: {
                disabled: this._currentScreen == CurrentScreen.Hangar ? "disabled" : "",
                onclick: () => {
                    window.location.href = "/mithril/#!/hangar/"
                }
            }
        };
        const btnMissions: HyperNode = {
            attrs: {
                disabled: this._currentScreen == CurrentScreen.Missions ? "disabled" : "",
                onclick: () => {
                    window.location.href = "/mithril/#!/missions/"
                }
            }
        };
        const btnPvp: HyperNode = {
            attrs: {
                disabled: this._currentScreen == CurrentScreen.Pvp ? "disabled" : "",
                onclick: () => {
                    window.location.href = "/mithril/#!/pvp/"
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
