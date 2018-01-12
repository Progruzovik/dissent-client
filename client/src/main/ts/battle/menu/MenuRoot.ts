import MainMenu from "./main/MainMenu";
import ShipsPanel from "./main/ShipsPanel";
import ShipInfo from "./ship/ShipInfo";
import Ship from "../ship/Ship";
import WebSocketClient from "../WebSocketClient";
import * as game from "../../game";

export default class MenuRoot extends game.AbstractRoot {

    private readonly menu = new MainMenu(this.webSocketClient);
    private shipInfo: ShipInfo;

    constructor(private readonly webSocketClient: WebSocketClient) {
        super();
        this.addChild(this.menu);
        this.reload();

        this.menu.on(ShipsPanel.OPEN_INFO, (ship: Ship) => {
            this.removeChildren();
            this.shipInfo = new ShipInfo(this.width, this.height, ship);
            this.addChild(this.shipInfo);

            this.shipInfo.once(game.Event.DONE, () => {
                this.removeChildren();
                this.shipInfo.destroy({ children: true });
                this.shipInfo = null;
                this.addChild(this.menu);
            });
        });
        this.menu.on(MainMenu.BATTLE, () => this.emit(MainMenu.BATTLE));
    }

    reload() {
        this.webSocketClient.updateStatus();
        this.webSocketClient.requestShips(sd => this.menu.shipsPanel.reload(sd));
    }

    protected onSetUpChildren(width: number, height: number) {
        this.menu.setUpChildren(width, height);
        if (this.shipInfo) {
            this.shipInfo.setUpChildren(width, height);
        }
    }
}
