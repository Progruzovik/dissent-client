import ShipInfo from "./ship/ShipInfo";
import Ships from "./Ships";
import Ship from "../../Ship";
import { ShipData, Status } from "../../util";
import { l } from "../../../localizer";
import * as druid from "pixi-druid";

export default class Hangar extends druid.AbstractBranch {

    static readonly BATTLE = "battle";

    private contentWidth = 0;
    private contentHeight = 0;

    private readonly ships = new Ships();
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

        this.ships.on(Ships.OPEN_INFO, (ship: Ship) => {
            this.layoutContent.visible = false;
            this.shipInfo = new ShipInfo(ship);
            this.shipInfo.pivot.set(this.shipInfo.width / 2, this.shipInfo.height / 2);
            this.addChild(this.shipInfo);
            this.setUpChildren(this.contentWidth, this.contentHeight);

            this.shipInfo.once(druid.Event.DONE, () => {
                this.layoutContent.visible = true;
                this.removeChild(this.shipInfo);
                this.shipInfo.destroy({ children: true });
                this.shipInfo = null;
            });
        });
    }

    setUpChildren(width: number, height: number): void {
        this.contentWidth = width;
        this.contentHeight = height;
        this.layoutContent.x = this.contentWidth / 2;
        if (this.shipInfo) {
            this.shipInfo.position.set(this.contentWidth / 2, this.contentHeight / 2);
        }
    }

    updateShipsData(shipsData: ShipData[]) {
        this.ships.updateInfo(shipsData);
        this.ships.pivot.x = this.ships.width / 2;
    }
}
