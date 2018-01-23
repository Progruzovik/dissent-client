import WebSocketClient from "../WebSocketClient";
import { l } from "../../localizer";
import * as druid from "pixi-druid";

export default class MissionBranch extends druid.AbstractBranch {

    private readonly layoutMissions = new druid.HorizontalLayout(druid.Alignment.Center);

    constructor(private readonly webSocketClient: WebSocketClient) {
        super();
        this.addChild(this.layoutMissions);
    }

    updateMissions(missions: string[]) {
        this.layoutMissions.removeElements();
        missions.forEach((m, i) => {
            const button = new druid.Button(l(m));
            this.layoutMissions.addElement(button);
            button.on(druid.Button.TRIGGERED, () => this.webSocketClient.startMission(i));
        });
        this.layoutMissions.pivot.set(this.layoutMissions.width / 2, this.layoutMissions.height / 2);
    }

    setUpChildren(width: number, height: number): void {
        this.layoutMissions.position.set(width / 2, height / 2);
    }
}
