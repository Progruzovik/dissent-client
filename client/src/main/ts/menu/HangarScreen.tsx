import Controls from "./Controls";
import Hangar from "../ship/Hangar";
import { l } from "../localizer";
import { CurrentScreen, HyperNode, MenuComponent } from "./util";
import * as druid from "pixi-druid";
import * as mithril from "mithril";

export default class HangarScreen extends MenuComponent {

    constructor(private readonly hangar: Hangar, private readonly controls: Controls) {
        super(mithril);
    }

    view(): mithril.Children {
        const ships: HyperNode = {
            children: this.hangar.ships.map((s, i) => {
                const imgShip: HyperNode = {
                    attrs: {
                        onclick: () => {
                            window.location.href = `#!/hangar/ship/${i}/`;
                        }
                    }
                };
                return <img src={`../img/${s.hull.texture.name}.png`} class="block icon-ship" {...imgShip.attrs} />;
            })
        };
        return (
            <div class="container u-centered">
                <h2><b>{l("hangar")}</b></h2>
                {ships.children}
            </div>
        );
    }

    oninit() {
        this.controls.currentScreen = CurrentScreen.Hangar;
        this.hangar.on(druid.Event.UPDATE, () => mithril.redraw());
    }

    onremove() {
        this.hangar.off(druid.Event.UPDATE);
    }
};
