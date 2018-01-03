import ShipInfo from "./ShipInfo";
import Menu from "./main/MainMenu";
import ShipsPanel from "./main/ShipsPanel";
import WebSocketClient from "../WebSocketClient";
import Ship from "../ship/Ship";
import { ShipData } from "../util";
import * as game from "../../game";

export default class MenuScreen extends game.Screen {

    private readonly menu: Menu;

    constructor(shipsData: ShipData[], webSocketClient: WebSocketClient) {
        super();
        this.menu = new Menu(shipsData, webSocketClient);
        this.frontUi = this.menu;

        this.menu.on(ShipsPanel.OPEN_INFO, (ship: Ship) => {
            const shipInfo = new ShipInfo(ship);
            this.frontUi = shipInfo;
            shipInfo.once(game.Event.DONE, () => {
               shipInfo.destroy({ children: true });
               this.frontUi = this.menu;
            });
        });
        this.menu.on(Menu.BATTLE, () => this.emit(Menu.BATTLE));
    }
}
