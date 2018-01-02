import WebSocketClient from "../WebSocketClient";
import { Status } from "../util";
import * as game from "../../game";

export default class Menu extends game.UiLayer {

    private status: Status;

    private readonly txtDissent = new PIXI.Text("Dissent", { fill: 0xffffff, fontSize: 48, fontWeight: "bold" });
    private readonly txtStatus = new PIXI.Text("", { fill: 0xffffff });

    private readonly btnQueue = new game.Button();
    private readonly buttonsGroup = new PIXI.Container();

    constructor(private readonly webSocketClient: WebSocketClient) {
        super();
        this.txtDissent.anchor.x = game.CENTER;
        this.addChild(this.txtDissent);
        this.txtStatus.anchor.x = game.CENTER;
        this.addChild(this.txtStatus);

        this.buttonsGroup.addChild(this.btnQueue);
        const btnScenario = new game.Button("PVE");
        btnScenario.x = this.btnQueue.width + game.INDENT;
        this.buttonsGroup.addChild(btnScenario);
        this.buttonsGroup.pivot.x = this.buttonsGroup.width / 2;
        this.addChild(this.buttonsGroup);

        this.webSocketClient.on(WebSocketClient.STATUS, (status: Status) => {
            this.status = status;
            if (status == Status.InBattle) {
                this.emit(game.Event.DONE);
            } else {
                this.updateStatus();
            }
        });
        this.btnQueue.on(game.Event.BUTTON_CLICK, () => {
            if (this.status == Status.Queued) {
                webSocketClient.removeFromQueue();
            } else {
                webSocketClient.addToQueue();
            }
        });
        btnScenario.on(game.Event.BUTTON_CLICK, () => webSocketClient.startScenario());

        webSocketClient.updateStatus();
    }

    resize(width: number, height: number) {
        this.txtDissent.position.set(width / 2, game.INDENT * 3);
        this.txtStatus.position.set(width / 2, this.txtDissent.y + this.txtDissent.height + game.INDENT / 2);
        this.buttonsGroup.position.set(width / 2, this.txtStatus.y + this.txtStatus.height + game.INDENT);
    }

    private updateStatus() {
        this.txtStatus.text = `Your status: ${Status[this.status]}`;
        if (this.status == Status.Queued) {
            this.btnQueue.text = "Out of queue";
        } else {
            this.btnQueue.text = "PVP";
        }
    }
}
