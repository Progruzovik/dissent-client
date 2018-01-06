import Ship from "../ship/Ship";
import { l } from "../../localizer";
import * as game from "../../game";
import * as PIXI from "pixi.js";

export default class ShipInfo extends game.UiLayer {

    private readonly content = new PIXI.Container();

    constructor(ship: Ship) {
        super();
        const iconShip = ship.createIcon();
        this.content.addChild(iconShip);
        const cardGuns = ship.createGunsCard();
        cardGuns.x = iconShip.width;
        this.content.addChild(cardGuns);

        const barStrength = ship.createStrengthBar(game.Button.WIDTH);
        barStrength.y = iconShip.height;
        this.content.addChild(barStrength);

        const btnBack = new game.Button(l("back"));
        btnBack.y = barStrength.y + barStrength.height + game.INDENT;
        this.content.addChild(btnBack);
        this.content.pivot.set(this.content.width / 2, this.content.height / 2);
        this.addChild(this.content);

        btnBack.on(game.Event.BUTTON_CLICK, () => this.emit(game.Event.DONE));
    }

    resize(width: number, height: number) {
        this.content.position.set(width / 2, height / 2);
    }
}
