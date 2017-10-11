import { deleteQueue, postQueue, postScenario } from "../request";
import * as game from "../../game";

export default class Menu extends game.UiElement {

    private readonly txtDissent = new PIXI.Text("Dissent", { fill: 0xffffff, fontSize: 48, fontWeight: "bold" });
    private readonly txtStatus = new PIXI.Text("Выбрите режим игры:", { fill: 0xffffff });
    private readonly btnQueue = new game.Button("PVP");
    private readonly btnStartPve = new game.Button("PVE");

    constructor() {
        super();
        this.txtDissent.anchor.x = game.CENTER;
        this.addChild(this.txtDissent);
        this.txtStatus.anchor.x = game.CENTER;
        this.addChild(this.txtStatus);
        this.btnQueue.pivot.x = this.btnQueue.width / 2;
        this.btnQueue.isEnabled = false;
        this.addChild(this.btnQueue);
        this.btnStartPve.pivot.x = this.btnStartPve.width / 2;
        this.addChild(this.btnStartPve);

        this.btnStartPve.on(game.Event.BUTTON_CLICK, () => postScenario(() => this.emit(game.Event.DONE)));
    }

    resize(width: number, height: number) {
        this.txtDissent.position.set(width / 2, 100);
        this.txtStatus.position.set(width / 2, this.txtDissent.y + this.txtDissent.height + game.INDENT);
        this.btnQueue.position.set(width / 2, this.txtStatus.y + this.txtStatus.height + game.INDENT);
        this.btnStartPve.position.set(width / 2, this.btnQueue.y + this.btnQueue.height + game.INDENT);
    }
}
