import Hangar from "./Hangar";
import { MenuComponent, ShipData } from "../util";
import * as m from "mithril";

export default class Ship extends MenuComponent {

    constructor(private readonly hangar: Hangar) {
        super(m);
    }

    view(vnode: m.CVnode<any>): m.Children {
        const ship: ShipData = this.hangar.ships[vnode.attrs.id];
        const imgShip = new Image();
        imgShip.src = `../img/${ship.hull.texture.name}.png`;
        imgShip.width *= 2;
        imgShip.height *= 2;
        return (
            <div class="flex flex-block">
                <div>
                    <div class="u-centered">
                        <h3><b>{ship.hull.name}</b></h3>
                    </div>
                    <div>
                        <h5>AP: {ship.hull.actionPoints}</h5>
                    </div>
                    <div class="flex block">
                        <div>
                            {m.trust(imgShip.outerHTML)}
                            <div class="flex red bar">{`${ship.strength}/${ship.hull.strength}`}</div>
                        </div>
                    </div>
                    <div>
                        <a href="/mithril/#!/hangar/" class="button">Назад</a>
                    </div>
                </div>
            </div>
        );
    }
}
