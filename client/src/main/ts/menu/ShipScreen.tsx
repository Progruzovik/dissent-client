import Controls from "./Controls";
import { CurrentScreen, HyperNode, MenuComponent } from "./util";
import Hangar from "../ship/Hangar";
import Ship from "../ship/Ship";
import { l } from "../localizer";
import * as druid from "pixi-druid";
import * as mithril from "mithril";

export default class ShipScreen extends MenuComponent {

    constructor(private readonly hangar: Hangar, private readonly controls: Controls) {
        super(mithril);
    }

    view(vnode: mithril.CVnode<any>): mithril.Children {
        const ship: Ship = this.hangar.ships[vnode.attrs.id];
        if (!ship) return null;

        const imgShip = new Image();
        imgShip.src = `../img/${ship.hull.texture.name}.png`;
        if (imgShip.complete) {
            imgShip.width *= 2;
            imgShip.height *= 2;
        } else {
            imgShip.onload = () => mithril.redraw();
        }

        const btnBack: HyperNode  = {
            attrs: {
                onclick: () => {
                    window.location.href = "/mithril/#!/hangar/"
                }
            }
        };

        return (
            <div class="page flex">
                <div>
                    <div class="u-centered">
                        <h3><b>{ship.hull.name}</b></h3>
                    </div>
                    <div>
                        <h5>{l("ap")}: {ship.hull.actionPoints}</h5>
                    </div>
                    <div class="flex block">
                        <div class="block">
                            {mithril.trust(imgShip.outerHTML)}
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
                        <button type="button" {...btnBack.attrs}>{l("back")}</button>
                    </div>
                </div>
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
}
