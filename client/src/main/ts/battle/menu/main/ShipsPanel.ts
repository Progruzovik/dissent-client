import Ship from "../../ship/Ship";
import { ShipData } from "../../util";
import { l } from "../../../localizer";
import * as game from "../../../game"
import * as PIXI from "pixi.js";

export default class ShipsPanel extends PIXI.Container {

    static readonly OPEN_INFO = "openInfo";

    private readonly txtFleet = new PIXI.Text(l("yourFleet"), { fill: "white", fontWeight: "bold" });
    private readonly groupShips = new PIXI.Container();

    constructor() {
        super();
        this.txtFleet.pivot.x = this.txtFleet.width / 2;
        this.addChild(this.txtFleet);
        this.groupShips.y = this.txtFleet.height;
        this.addChild(this.groupShips);
    }

    reload(shipsData: ShipData[]) {
        this.groupShips.removeChildren();
        shipsData.forEach((sd, i) => {
            const ship = new Ship(sd);
            const iconDefault = ship.createSprite();
            const iconOver = ship.createSprite();
            iconOver.addChild(new game.Frame(iconOver.width, iconOver.height, 1, 0xffff00));
            const btnShip = new game.Button("", iconDefault, iconOver, iconOver, iconDefault);
            btnShip.x = this.groupShips.width + game.INDENT / 2 * i;
            this.groupShips.addChild(btnShip);

            btnShip.on(game.Event.BUTTON_CLICK, () => this.emit(ShipsPanel.OPEN_INFO, ship));
        });
        this.groupShips.pivot.x = this.groupShips.width / 2;
    }

    resize(width: number) {
        this.txtFleet.x = width / 2;
        this.groupShips.x = width / 2;
    }
}
