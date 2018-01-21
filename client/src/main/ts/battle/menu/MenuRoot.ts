import Hangar from "./hangar/Hangar";
import ShipsPanel from "./hangar/Ships";
import ShipInfo from "./hangar/ship/ShipInfo";
import Controls from "./Controls";
import Ship from "../Ship";
import WebSocketClient from "../WebSocketClient";
import * as druid from "pixi-druid";

export default class MenuRoot extends druid.AbstractBranch {

    private contentWidth = 0;
    private contentHeight = 0;

    private readonly hangar = new Hangar(this.webSocketClient);
    private shipInfo: ShipInfo;

    private readonly controls = new Controls();

    constructor(private readonly webSocketClient: WebSocketClient) {
        super();
        this.hangar.pivot.x = this.hangar.width / 2;
        this.addChild(this.hangar);
        this.addChild(this.controls);
        this.updateInfo();

        this.hangar.on(ShipsPanel.OPEN_INFO, (ship: Ship) => {
            this.removeChildren();
            this.shipInfo = new ShipInfo(this.contentWidth, this.contentHeight, ship);
            this.shipInfo.pivot.set(this.shipInfo.width / 2, this.shipInfo.height / 2);
            this.addChild(this.shipInfo);
            this.setUpChildren(this.contentWidth, this.contentHeight);

            this.shipInfo.once(druid.Event.DONE, () => {
                this.removeChildren();
                this.shipInfo.destroy({ children: true });
                this.shipInfo = null;
                this.addChild(this.hangar);
            });
        });
        this.hangar.on(Hangar.BATTLE, () => this.emit(Hangar.BATTLE));
    }

    updateInfo() {
        this.webSocketClient.updateStatus();
        this.webSocketClient.requestShips(sd => this.hangar.updateShipsData(sd));
    }

    setUpChildren(width: number, height: number) {
        this.controls.setUpChildren(width, height);
        this.controls.pivot.y = this.controls.height;
        this.controls.y = height;
        this.contentWidth = width;
        this.contentHeight = height - this.controls.height;

        this.hangar.position.set(this.contentWidth / 2, druid.INDENT * 3);
        if (this.shipInfo) {
            this.shipInfo.position.set(this.contentWidth / 2, this.contentHeight / 2);
        }
    }
}
