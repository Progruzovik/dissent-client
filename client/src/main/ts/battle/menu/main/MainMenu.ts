import ShipsPanel from "./ShipsPanel";
import WebSocketClient from "../../WebSocketClient";
import Ship from "../../ship/Ship";
import { Status } from "../../util";
import { l } from "../../../localizer";
import * as druid from "pixi-druid";

export default class Menu extends druid.AbstractBranch {

    static readonly BATTLE = "battle";

    private status: Status;

    private readonly txtDissent = new PIXI.Text("Dissent",
        { fill: "white", fontSize: 48, fontWeight: "bold" });
    private readonly txtStatus = new PIXI.Text("", { fill: "white" });

    private readonly btnQueue = new druid.Button();
    private readonly groupButtons = new PIXI.Container();

    readonly shipsPanel = new ShipsPanel();

    constructor(webSocketClient: WebSocketClient) {
        super();
        this.txtDissent.anchor.x = druid.CENTER;
        this.addChild(this.txtDissent);
        this.txtStatus.anchor.x = druid.CENTER;
        this.addChild(this.txtStatus);

        this.groupButtons.addChild(this.btnQueue);
        const btnScenario = new druid.Button("PVE");
        btnScenario.x = this.btnQueue.width + druid.INDENT;
        this.groupButtons.addChild(btnScenario);
        this.groupButtons.pivot.x = this.groupButtons.width / 2;
        this.addChild(this.groupButtons);

        this.addChild(this.shipsPanel);

        webSocketClient.on(WebSocketClient.STATUS, (status: Status) => {
            this.status = status;
            if (status == Status.InBattle) {
                this.emit(Menu.BATTLE);
            } else {
                this.updateStatus();
            }
        });
        this.btnQueue.on(druid.Button.TOGGLE, () => {
            if (this.status == Status.Queued) {
                webSocketClient.removeFromQueue();
            } else {
                webSocketClient.addToQueue();
            }
        });
        btnScenario.on(druid.Button.TOGGLE, () => webSocketClient.startScenario());
        this.shipsPanel.on(ShipsPanel.OPEN_INFO, (ship: Ship) => this.emit(ShipsPanel.OPEN_INFO, ship));
    }

    setUpChildren(width: number, height: number) {
        this.txtDissent.position.set(width / 2, druid.INDENT * 3);
        this.txtStatus.position.set(width / 2, this.txtDissent.y + this.txtDissent.height + druid.INDENT / 2);
        this.groupButtons.position.set(width / 2, this.txtStatus.y + this.txtStatus.height + druid.INDENT);
        this.shipsPanel.resize(width);
        this.shipsPanel.y = this.groupButtons.y + this.groupButtons.height + druid.INDENT * 2;
    }

    private updateStatus() {
        this.txtStatus.text = `${l("yourStatus")}: ${Status[this.status]}`;
        if (this.status == Status.Queued) {
            this.btnQueue.text = l("fromQueue");
        } else {
            this.btnQueue.text = "PVP";
        }
    }
}
