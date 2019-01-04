import { HangarService } from "./service/HangarService";
import { l } from "../localizer";
import { HyperNode } from "../util";
import * as css from "../../css/hangar.css";
import * as druid from "pixi-druid";
import * as m from "mithril";

export class IndexPage implements m.ClassComponent {

    constructor(private readonly hangarService: HangarService) {}

    oninit() {
        this.hangarService.on(druid.Event.UPDATE, () => m.redraw());
    }

    onremove() {
        this.hangarService.off(druid.Event.UPDATE);
    }

    view(): m.Children {
        const ships: HyperNode = {
            children: this.hangarService.ships.map((s, i) => {
                const imgShip: HyperNode = {
                    attrs: {
                        src: `../img/${s.hull.texture.name}.png`,
                        onclick: () => m.route.set(`/hangar/ship/${i}/`)
                    }
                };
                return m(`img.${css.interactive}.link.block`, imgShip.attrs);
            })
        };
        return m(".container.centered",
            m("h2", m("b", l("Hangar"))),
            m("", ships.children)
        );
    }
}
