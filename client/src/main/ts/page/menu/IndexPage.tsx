import MenuData from "./model/MenuData";
import { l } from "../../localizer";
import { HyperNode, MenuComponent } from "../util";
import * as druid from "pixi-druid";
import * as mithril from "mithril";

export default class IndexPage extends MenuComponent {

    constructor(private readonly menuData: MenuData) {
        super(mithril);
    }

    oninit() {
        this.menuData.on(druid.Event.UPDATE, () => mithril.redraw());
    }

    onremove() {
        this.menuData.off(druid.Event.UPDATE);
    }

    view(): mithril.Children {
        const ships: HyperNode = {
            children: this.menuData.ships.map((s, i) => {
                const imgShip: HyperNode = {
                    attrs: {
                        onclick: () => {
                            window.location.href = `#!/hangar/ship/${i}/`;
                        }
                    }
                };
                return <img src={`../img/${s.hull.texture.name}.png`}
                            class="interactive block interactive-yellow" {...imgShip.attrs} />;
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
