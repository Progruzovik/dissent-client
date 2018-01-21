import Ships from "./Ships";
import WebSocketClient from "../../WebSocketClient";
import Ship from "../../Ship";
import { ShipData, Status } from "../../util";
import { l } from "../../../localizer";
import * as druid from "pixi-druid";

export default class Menu extends druid.HorizontalLayout {

    static readonly BATTLE = "battle";

    private status: Status;

    private readonly txtStatus = new PIXI.Text("", { fill: "white" });
    private readonly btnQueue = new druid.Button();
    private readonly layoutShips = new Ships();

    constructor(webSocketClient: WebSocketClient) {
        super(druid.Alignment.Center);
        this.addElement(new PIXI.Text("Dissent", { fill: "white", fontSize: 48, fontWeight: "bold" }));
        this.addElement(this.txtStatus);

        const layoutControls = new druid.VerticalLayout();
        layoutControls.addElement(this.btnQueue);
        const btnScenario = new druid.Button("PVE");
        layoutControls.addElement(btnScenario);
        this.addElement(layoutControls);

        this.addElement(new PIXI.Text(l("yourFleet"), { fill: "white", fontWeight: "bold" }));
        this.addElement(this.layoutShips);

        webSocketClient.on(WebSocketClient.STATUS, (status: Status) => {
            this.status = status;
            if (status == Status.InBattle) {
                this.emit(Menu.BATTLE);
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
        btnScenario.on(druid.Button.TRIGGERED, () => webSocketClient.startScenario());
        this.layoutShips.on(Ships.OPEN_INFO, (ship: Ship) => this.emit(Ships.OPEN_INFO, ship));
    }

    updateShipsData(shipsData: ShipData[]) {
        this.layoutShips.updateInfo(shipsData);
        this.layoutShips.pivot.x = this.layoutShips.width / 2;
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
