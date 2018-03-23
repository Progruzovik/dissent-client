import { HangarService } from "./service/HangarService";
import Ship from "../../model/Ship";
import { HyperNode } from "../util";
import { l } from "../../localizer";
import * as css from "../../../css/hangar.css";
import * as druid from "pixi-druid";
import * as m from "mithril";

export class ShipPage implements m.ClassComponent {

    private selectedGunId = 0;

    constructor(private readonly hangarData: HangarService) {}

    oninit() {
        this.hangarData.on(druid.Event.UPDATE, () => m.redraw());
    }

    onremove() {
        this.selectedGunId = 0;
        this.hangarData.rightPanelContent = null;
        this.hangarData.off(druid.Event.UPDATE);
    }

    view(vnode: m.Vnode<any>): m.Children {
        const ship: Ship = this.hangarData.ships[vnode.attrs.id];
        if (!ship) return null;

        const imgShip = new Image();
        imgShip.src = `../img/${ship.hull.texture.name}.png`;
        if (imgShip.complete) {
            imgShip.width *= 2;
            imgShip.height *= 2;
        } else {
            imgShip.onload = () => m.redraw();
        }
        const blockGuns: HyperNode = {
            children: ship.guns.map(g => {
                let blockGun: HyperNode;
                if (this.selectedGunId == g.id) {
                    blockGun = {
                        attrs: {
                            class: `${css.blockModule} grey border-yellow centered`,
                        }
                    };
                } else {
                    blockGun = {
                        attrs: {
                            class: `${css.blockModule} grey interactive interactive-yellow centered`,
                            onclick: () => {
                                this.selectedGunId = g.id;
                                this.hangarData.rightPanelContent = (
                                    m(".grey.page.flex.centered",
                                        m(`.${css.panemModuleInfo}`,
                                            m("h4", m("b", l(g.name))),
                                            m("hr"),
                                            m("h5", `${l("Type")}: ${l(g.typeName)}`),
                                            m("h5", `${l("ShotCost")}: ${g.shotCost}`),
                                            m("h5", `${l("Damage")}: ${g.damage}`),
                                            m("h5", `${l("Radius")}: ${g.radius}`)
                                        )
                                    )
                                );
                            }
                        }
                    };
                }
                return m(".flex.block",
                    m("", blockGun.attrs,
                        m("h5", l(g.name)),
                        m("img",
                            { src: `../img/${g.texture.name}.png`, width: "50%", height: "50%" })
                    )
                );
            })
        };

        const btnBack: HyperNode = {
            attrs: {
                type: "button",
                onclick: () => {
                    window.location.href = "#!/hangar/"
                }
            }
        };

        return m(".page.flex",
            m("",
                m(".centered", m("h3", m("b", ship.hull.name))),
                m("", m("h5", `${l("AP")}: ${ship.hull.actionPoints}`)),
                m(".flex.block",
                    m(".block",
                        m.trust(imgShip.outerHTML),
                        m(".flex.red.bar", `${ship.strength}/${ship.hull.strength}`)
                    ),
                    blockGuns.children
                ),
                m("", m("button", btnBack.attrs, l("Back")))
            )
        );
    }
}
