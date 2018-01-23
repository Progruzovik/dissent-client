import Ship from "../../Ship";
import { ShipData } from "../../util";
import * as druid from "pixi-druid"

export default class ShipsLayout extends druid.VerticalLayout {

    static readonly OPEN_INFO = "openInfo";

    constructor() {
        super(druid.INDENT);
    }

    updateInfo(shipsData: ShipData[]) {
        this.removeElements();
        for (const shipData of shipsData) {
            const ship = new Ship(shipData);
            const iconDefault = ship.createSprite();
            const iconOver = ship.createSprite();
            iconOver.addChild(new druid.Frame(iconOver.width, iconOver.height, 1, 0xffff00));
            const btnShip = new druid.Button("", iconDefault, iconOver, iconOver, iconDefault);
            this.addElement(btnShip);

            btnShip.on(druid.Button.TRIGGERED, () => this.emit(ShipsLayout.OPEN_INFO, ship));
        }
    }
}
