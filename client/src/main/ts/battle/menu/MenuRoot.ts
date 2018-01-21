import MainMenu from "./main/MainMenu";
import ShipsPanel from "./main/Ships";
import ShipInfo from "./ship/ShipInfo";
import Ship from "../Ship";
import WebSocketClient from "../WebSocketClient";
import * as druid from "pixi-druid";

export default class MenuRoot extends druid.AbstractBranch {

    private savedWidth = 0;
    private savedHeight = 0;

    private readonly menu = new MainMenu(this.webSocketClient);
    private shipInfo: ShipInfo;

    constructor(private readonly webSocketClient: WebSocketClient) {
        super();
        this.menu.pivot.x = this.menu.width / 2;
        this.addChild(this.menu);
        this.updateInfo();

        this.menu.on(ShipsPanel.OPEN_INFO, (ship: Ship) => {
            this.removeChildren();
            this.shipInfo = new ShipInfo(this.savedWidth, this.savedHeight, ship);
            this.shipInfo.pivot.set(this.shipInfo.width / 2, this.shipInfo.height / 2);
            this.addChild(this.shipInfo);
            this.setUpChildren(this.savedWidth, this.savedHeight);

            this.shipInfo.once(druid.Event.DONE, () => {
                this.removeChildren();
                this.shipInfo.destroy({ children: true });
                this.shipInfo = null;
                this.addChild(this.menu);
            });
        });
        this.menu.on(MainMenu.BATTLE, () => this.emit(MainMenu.BATTLE));
    }

    updateInfo() {
        this.webSocketClient.updateStatus();
        this.webSocketClient.requestShips(sd => this.menu.updateShipsData(sd));
    }

    setUpChildren(width: number, height: number) {
        this.savedWidth = width;
        this.savedHeight = height;
        this.menu.position.set(width / 2, druid.INDENT * 3);
        if (this.shipInfo) {
            this.shipInfo.position.set(width / 2, height / 2);
        }
    }
}
