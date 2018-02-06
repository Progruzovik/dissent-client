import Hangar from "../ship/Hangar";
import Ship from "../ship/Ship";
import { l } from "../localizer";
import { MenuComponent } from "../util";
import * as druid from "pixi-druid";
import * as m from "mithril";

export default class ShipScreen extends MenuComponent {

    constructor(private readonly hangar: Hangar) {
        super(m);
    }

    view(vnode: m.CVnode<any>): m.Children {
        const ship: Ship = this.hangar.ships[vnode.attrs.id];
        if (!ship) return null;

        const imgShip = new Image();
        imgShip.src = `../img/${ship.hull.texture.name}.png`;
        imgShip.width *= 2;
        imgShip.height *= 2;
        return (
            <div class="flex flex-page">
                <div>
                    <div class="u-centered">
                        <h3><b>{ship.hull.name}</b></h3>
                    </div>
                    <div>
                        <h5>{l("ap")}: {ship.hull.actionPoints}</h5>
                    </div>
                    <div class="flex block">
                        <div class="block">
                            {m.trust(imgShip.outerHTML)}
                            <div class="flex red bar">{`${ship.strength}/${ship.hull.strength}`}</div>
                        </div>
                        {ship.guns.map(g => {
                            return (
                                <div class="flex block">
                                    <div class="block-gun u-centered">
                                        <h5>{l(g.name)}</h5>
                                        <img src={`../img/${g.texture.name}.png`} width="50%" height="50%" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div>
                        <a href="/mithril/#!/hangar/" class="button">{l("back")}</a>
                    </div>
                </div>
            </div>
        );
    }

    oninit() {
        this.hangar.on(druid.Event.UPDATE, () => m.redraw());
    }

    onremove() {
        this.hangar.off(druid.Event.UPDATE);
    }
}
