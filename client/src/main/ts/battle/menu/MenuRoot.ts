import Hangar from "./hangar/Hangar";
import Controls from "./Controls";
import Title from "./Title";
import WebSocketClient from "../WebSocketClient";
import * as druid from "pixi-druid";
import * as PIXI from "pixi.js";

export default class MenuRoot extends druid.AbstractBranch {

    private readonly hangar = new Hangar(this.webSocketClient);
    private readonly controls = new Controls();

    constructor(private readonly webSocketClient: WebSocketClient) {
        super();
        const txtTitle = new PIXI.Text("Dissent <tech demo>", { fontSize: 14, fontStyle: "italic" });
        this.addChild(new druid.Rectangle(txtTitle.width + druid.INDENT, 16, 0xdedede));
        txtTitle.x = druid.INDENT / 2;
        this.addChild(txtTitle);
        this.addChild(this.hangar);
        this.addChild(this.controls);
        this.updateInfo();

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

        const freeHeight = height - this.controls.height;
        this.hangar.setUpChildren(width, freeHeight);
    }
}
