import Hangar from "../ship/Hangar";
import { l } from "../localizer";
import { MenuComponent } from "../util";
import * as druid from "pixi-druid";
import * as m from "mithril";

export default class HangarScreen extends MenuComponent {

    constructor(private readonly hangar: Hangar) {
        super(m);
    }

    view(): m.Children {
        return (
            <div class="container u-centered">
                <h2><b>{l("hangar")}</b></h2>
                {this.hangar.ships.map((s, i) => {
                    return (
                        <a href={`/mithril/#!/hangar/ship/${i}/`} class="block">
                            <img src={`../img/${s.hull.texture.name}.png`} class="icon-ship" />
                        </a>
                    );
                })}
            </div>
        );
    }

    oninit() {
        this.hangar.on(druid.Event.UPDATE, () => m.redraw());
    }

    onremove() {
        this.hangar.off(druid.Event.UPDATE);
    }
};
