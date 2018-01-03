import Ship from "../ship/Ship";
import { l } from "../../localizer";
import * as game from "../../game";

export default class ShipInfo extends game.UiLayer {

    private readonly content = new PIXI.Container();

    constructor(ship: Ship) {
        super();
        const btnBack = new game.Button(l("back"));
        this.content.addChild(btnBack);
        this.content.pivot.set(this.content.width / 2, this.content.height / 2);
        this.addChild(this.content);

        btnBack.on(game.Event.BUTTON_CLICK, () => this.emit(game.Event.DONE));
    }

    resize(width: number, height: number) {
        this.content.position.set(width / 2, height / 2);
    }
}
