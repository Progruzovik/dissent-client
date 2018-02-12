import MenuData from "../model/MenuData";
import Layout from "../Layout";
import Ship from "../../model/Ship";
import { HyperNode, MenuComponent } from "../util";
import { l } from "../../localizer";
import * as druid from "pixi-druid";
import * as mithril from "mithril";

export default class ShipPage extends MenuComponent {

    private selectedGunId = 0;

    constructor(private readonly menuData: MenuData) {
        super(mithril);
    }

    oninit() {
        this.menuData.on(druid.Event.UPDATE, () => mithril.redraw());
    }

    onremove() {
        this.selectedGunId = 0;
        this.menuData.rightPanelContent = null;
        this.menuData.off(druid.Event.UPDATE);
    }

    view(vnode: mithril.CVnode<any>): mithril.Children {
        const ship: Ship = this.menuData.ships[vnode.attrs.id];
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
                                    class: "grey interactive block-module interactive-yellow u-centered",
                                    onclick: () => {
                                        this.selectedGunId = g.id;
                                        this.menuData.rightPanelContent = (
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
                            if (this.selectedGunId == g.id) {
                                blockGun.attrs.class += " border-yellow";
                            }

                            return (
                                <div class="flex block">
                                    <div {...blockGun.attrs}>
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
