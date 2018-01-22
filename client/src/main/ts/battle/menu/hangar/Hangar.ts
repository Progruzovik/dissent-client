import ShipInfo from "./ship/ShipInfo";
import Ships from "./Ships";
import WebSocketClient from "../../WebSocketClient";
import Ship from "../../Ship";
import { ShipData, Status } from "../../util";
import { l } from "../../../localizer";
import * as druid from "pixi-druid";

export default class Hangar extends druid.AbstractBranch {

    static readonly BATTLE = "battle";

    private contentWidth = 0;
    private contentHeight = 0;

    private status: Status;

    private readonly txtStatus = new PIXI.Text("", { fill: "white" });
    private readonly btnQueue = new druid.Button();
    private readonly ships = new Ships();
    private readonly layoutContent = new druid.HorizontalLayout(druid.Alignment.Center);

    private shipInfo: ShipInfo;

    constructor(webSocketClient: WebSocketClient) {
        super();
        this.layoutContent.addElement(this.txtStatus);

        const layoutControls = new druid.VerticalLayout();
        layoutControls.addElement(this.btnQueue);
        const btnMission = new druid.Button("PVE");
        layoutControls.addElement(btnMission);
        this.layoutContent.addElement(layoutControls);

        this.layoutContent.addElement(new PIXI.Text(l("yourHangar"), { fill: "white", fontWeight: "bold" }));
        this.layoutContent.addElement(this.ships);
        this.layoutContent.pivot.x = this.layoutContent.width / 2;
        this.layoutContent.y = druid.INDENT;
        this.addChild(this.layoutContent);

        webSocketClient.on(WebSocketClient.STATUS, (status: Status) => {
            this.status = status;
            if (status == Status.InBattle) {
                this.emit(Hangar.BATTLE);
            } else {
                this.updateStatus();
            }
        });
        this.btnQueue.on(druid.Button.TRIGGERED, () => {
            if (this.status == Status.Queued) {
                webSocketClient.removeFromQueue();
            } else {
                webSocketClient.addToQueue();
            }
        });
        btnMission.on(druid.Button.TRIGGERED, () => webSocketClient.startMission());
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

    private updateStatus() {
        this.txtStatus.text = `${l("yourStatus")}: ${Status[this.status]}`;
        this.txtStatus.pivot.x = this.txtStatus.width / 2;
        if (this.status == Status.Queued) {
            this.btnQueue.text = l("leaveQueue");
        } else {
            this.btnQueue.text = "PVP";
        }
    }
}
