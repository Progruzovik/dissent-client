import ShipInfo from "./info/ShipInfo";
import InteractiveContainer from "../../ui/InteractiveContainer";
import Ship from "../../../model/Ship";
import { ShipData } from "../../../model/util";
import { l } from "../../../localizer";
import * as druid from "pixi-druid";

export default class Hangar extends druid.AbstractBranch {

    static readonly BATTLE = "battle";

    private contentWidth = 0;
    private contentHeight = 0;

    private readonly ships = new druid.VerticalLayout();
    private readonly layoutContent = new druid.HorizontalLayout(druid.Alignment.Center);

    private shipInfo: ShipInfo;

    constructor() {
        super();
        const txtHangar = new PIXI.Text(l("hangar"), { fill: "white", fontSize: 40, fontWeight: "bold" });
        this.layoutContent.addElement(txtHangar);
        this.layoutContent.addElement(this.ships);
        this.layoutContent.pivot.x = this.layoutContent.width / 2;
        this.layoutContent.y = druid.INDENT * 2;
        this.addChild(this.layoutContent);
    }

    setUpChildren(width: number, height: number): void {
        this.contentWidth = width;
        this.contentHeight = height;
        this.layoutContent.x = width / 2;
        if (this.shipInfo) {
            this.shipInfo.setUpChildren(width, height);
        }
    }

    updateShipsData(shipsData: ShipData[]) {
        this.ships.removeElements();
        for (const shipData of shipsData) {
            const ship = new Ship(shipData);
            const spriteShip: PIXI.Sprite = ship.createSprite();
            const containerShip = new InteractiveContainer(spriteShip.width, spriteShip.height, 0xffff00);
            containerShip.addChild(spriteShip);
            this.ships.addElement(containerShip);

            containerShip.on(druid.Event.MOUSE_UP, () => this.openShipInfo(ship));
        }
        this.ships.pivot.x = this.ships.width / 2;
    }

    reset() {
        this.layoutContent.visible = true;
        if (this.shipInfo) {
            this.removeChild(this.shipInfo);
            this.shipInfo.destroy({ children: true });
            this.shipInfo = null;
        }
    }

    private openShipInfo(ship: Ship) {
        this.layoutContent.visible = false;
        this.shipInfo = new ShipInfo(ship);
        this.addChild(this.shipInfo);
        this.setUpChildren(this.contentWidth, this.contentHeight);

        this.shipInfo.once(druid.Event.DONE, () => this.reset());
    }
}
