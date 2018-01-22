import WebSocketClient from "../WebSocketClient";
import { Status } from "../util";
import { l } from "../../localizer";
import * as druid from "pixi-druid";

export default class MissionBranch extends druid.AbstractBranch {

    private readonly btnMission = new druid.Button("Test mission");

    constructor(webSocketClient: WebSocketClient) {
        super();
        this.btnMission.pivot.set(this.btnMission.width / 2, this.btnMission.height / 2);
        this.addChild(this.btnMission);

        this.btnMission.on(druid.Button.TRIGGERED, () => webSocketClient.startMission());
    }

    setUpChildren(width: number, height: number): void {
        this.btnMission.position.set(width / 2, height / 2);
    }
}
