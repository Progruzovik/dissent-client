import { postScenario } from "../request";
import * as game from "../../game";

export default class Menu extends game.UiElement {

    private readonly txtDissent = new PIXI.Text("Dissent", { fill: 0xFFFFFF, fontSize: 48, fontWeight: "bold" });
    private readonly btnStartPvp = new game.Button("PVP");
    private readonly btnStartPve = new game.Button("PVE");

    constructor() {
        super();
        this.txtDissent.anchor.x = game.CENTER;
        this.addChild(this.txtDissent);
        this.btnStartPvp.pivot.x = this.btnStartPvp.width / 2;
        this.btnStartPvp.isEnabled = false;
        this.addChild(this.btnStartPvp);
        this.btnStartPve.pivot.x = this.btnStartPve.width / 2;
        this.addChild(this.btnStartPve);

        this.btnStartPve.on(game.Event.BUTTON_CLICK, () => postScenario(() => this.emit(game.Event.DONE)));
    }

    resize(width: number, height: number) {
        this.txtDissent.position.set(width / 2, 100);
        this.btnStartPvp.position.set(width / 2, this.txtDissent.y + this.txtDissent.height + game.INDENT);
        this.btnStartPve.position.set(width / 2, this.btnStartPvp.y + this.btnStartPvp.height + game.INDENT);
    }
}
