import Controls from "../Controls";
import Hangar from "../../model/Hangar";
import { l } from "../../localizer";
import { CurrentScreen, HyperNode, MenuComponent } from "../util";
import * as druid from "pixi-druid";
import * as mithril from "mithril";

export default class HangarPage extends MenuComponent {

    constructor(private readonly hangar: Hangar, private readonly controls: Controls) {
        super(mithril);
    }

    oninit() {
        this.controls.currentScreen = CurrentScreen.Hangar;
        this.hangar.on(druid.Event.UPDATE, () => mithril.redraw());
    }

    onremove() {
        this.hangar.off(druid.Event.UPDATE);
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
                return <img src={`../img/${s.hull.texture.name}.png`}
                            class="interactive block border-yellow" {...imgShip.attrs} />;
            })
        };
        return (
            <div class="container u-centered">
                <h2><b>{l("hangar")}</b></h2>
                {ships.children}
            </div>
        );
    }
};
