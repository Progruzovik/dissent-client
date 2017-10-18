import WebSocketConnection from "../WebSocketConnection";
import { deleteQueue, postQueue, postScenario, Status } from "../request";
import { Subject } from "../util";
import * as game from "../../game";

export default class Menu extends game.UiElement {

    private readonly txtDissent = new PIXI.Text("Dissent", { fill: 0xffffff, fontSize: 48, fontWeight: "bold" });
    private readonly txtStatus = new PIXI.Text("", { fill: 0xffffff });
    private readonly btnQueue = new game.Button();
    private readonly btnScenario = new game.Button("PVE");

    constructor(private status: Status, private readonly webSocketConnection: WebSocketConnection) {
        super();
        this.txtDissent.anchor.x = game.CENTER;
        this.addChild(this.txtDissent);
        this.txtStatus.anchor.x = game.CENTER;
        this.addChild(this.txtStatus);
        this.btnQueue.pivot.x = this.btnQueue.width / 2;
        this.addChild(this.btnQueue);
        this.btnScenario.pivot.x = this.btnScenario.width / 2;
        this.addChild(this.btnScenario);
        this.updateInterface();

        this.btnQueue.on(game.Event.BUTTON_CLICK, () => {
            if (this.status == Status.Queued) {
                deleteQueue();
            } else {
                postQueue();
            }
        });
        this.btnScenario.on(game.Event.BUTTON_CLICK, postScenario);
        this.webSocketConnection.on(Subject[Subject.Status], (status: Status) => {
            this.status = status;
            if (status == Status.InBattle) {
                this.emit(game.Event.DONE);
            } else {
                this.updateInterface();
            }
        });
    }

    resize(width: number, height: number) {
        this.txtDissent.position.set(width / 2, 100);
        this.txtStatus.position.set(width / 2, this.txtDissent.y + this.txtDissent.height + game.INDENT);
        this.btnQueue.position.set(width / 2, this.txtStatus.y + this.txtStatus.height + game.INDENT);
        this.btnScenario.position.set(width / 2, this.btnQueue.y + this.btnQueue.height + game.INDENT);
    }

    private updateInterface() {
        this.txtStatus.text = "Current status: " + Status[this.status];
        if (this.status == Status.Queued) {
            this.btnQueue.text = "Out of queue";
        } else {
            this.btnQueue.text = "PVP";
        }
    }
}
