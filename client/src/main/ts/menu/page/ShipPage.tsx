import MenuStorage from "../model/MenuStorage";
import Layout from "../Layout";
import Ship from "../../model/Ship";
import { HyperNode, MenuComponent } from "../util";
import { l } from "../../localizer";
import * as druid from "pixi-druid";
import * as mithril from "mithril";

export default class ShipPage extends MenuComponent {

    constructor(private readonly menuStorage: MenuStorage) {
        super(mithril);
    }

    oninit() {
        this.menuStorage.on(druid.Event.UPDATE, () => mithril.redraw());
    }

    onremove() {
        this.menuStorage.rightPanelContent = null;
        this.menuStorage.off(druid.Event.UPDATE);
    }

    view(vnode: mithril.CVnode<any>): mithril.Children {
        const ship: Ship = this.menuStorage.ships[vnode.attrs.id];
        if (!ship) return null;

        const imgShip = new Image();
        imgShip.src = `../img/${ship.hull.texture.name}.png`;
        if (imgShip.complete) {
            imgShip.width *= 2;
            imgShip.height *= 2;
        } else {
            imgShip.onload = () => mithril.redraw();
        }

        const btnBack: HyperNode = {
            attrs: {
                onclick: () => {
                    window.location.href = "#!/hangar/"
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
                            const blockGun: HyperNode = {
                                attrs: {
                                    onclick: () => {
                                        this.menuStorage.rightPanelContent = (
                                            <div class="grey page flex u-centered">
                                                <div class="panel-module-info">
                                                    <h4><b>{l(g.name)}</b></h4>
                                                    <hr />
                                                    <h5>{`${l("type")}: ${l(g.typeName)}`}</h5>
                                                    <h5>{`${l("shotCost")}: ${g.shotCost} ${l("ap")}`}</h5>
                                                    <h5>{`${l("Damage")}: ${g.damage}`}</h5>
                                                    <h5>{`${l("radius")}: ${g.radius}`}</h5>
                                                </div>
                                            </div>
                                        );
                                    }
                                }
                            };

                            return (
                                <div class="flex block">
                                    <div class="grey interactive block-module border-yellow u-centered"
                                         {...blockGun.attrs}>
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
}
