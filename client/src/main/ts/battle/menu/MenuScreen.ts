import ShipInfo from "./ShipInfo";
import MainMenu from "./main/MainMenu";
import ShipsPanel from "./main/ShipsPanel";
import WebSocketClient from "../WebSocketClient";
import Ship from "../ship/Ship";
import * as game from "../../game";

export default class MenuScreen extends game.Screen {

    private readonly menu = new MainMenu(this.webSocketClient);

    constructor(private readonly webSocketClient: WebSocketClient) {
        super();
        this.frontUi = this.menu;
        this.reload();

        this.menu.on(ShipsPanel.OPEN_INFO, (ship: Ship) => {
            const shipInfo = new ShipInfo(ship);
            this.frontUi = shipInfo;
            shipInfo.once(game.Event.DONE, () => {
               shipInfo.destroy({ children: true });
               this.frontUi = this.menu;
            });
        });
        this.menu.on(MainMenu.BATTLE, () => this.emit(MainMenu.BATTLE));
    }

    reload() {
        this.webSocketClient.updateStatus();
        this.webSocketClient.requestShips(sd => this.menu.shipsPanel.reload(sd));
    }
}
