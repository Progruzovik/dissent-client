import Hangar from "./hangar/Hangar";
import Controls from "./Controls";
import WebSocketClient from "../WebSocketClient";
import * as druid from "pixi-druid";

export default class MenuRoot extends druid.AbstractBranch {

    private readonly hangar = new Hangar(this.webSocketClient);
    private readonly controls = new Controls();

    constructor(private readonly webSocketClient: WebSocketClient) {
        super();
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
        this.hangar.setUpChildren(width, height - this.controls.height);
    }
}
