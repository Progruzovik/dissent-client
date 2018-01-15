import Ship from "../../ship/Ship";
import { l } from "../../../localizer";
import * as druid from "pixi-druid";
import * as PIXI from "pixi.js";

export default class ShipInfo extends druid.AbstractBranch {

    private readonly txtName: PIXI.Text;
    private readonly content = new PIXI.Container();

    constructor(width: number, height: number, ship: Ship) {
        super();
        this.txtName = new PIXI.Text(ship.hull.name, { fill: "white", fontSize: 32, fontWeight: "bold" });
        this.txtName.anchor.set(druid.CENTER, 1);
        this.addChild(this.txtName);

        const txtAp = new PIXI.Text(`${l("ap")}: ${ship.hull.actionPoints}`, { fill: "white", fontSize: 24 });
        this.content.addChild(txtAp);

        const iconShip = ship.createSprite();
        iconShip.scale.set(2, 2);
        iconShip.y = txtAp.height;
        this.content.addChild(iconShip);
        const cardGuns = ship.createGunsCard();
        cardGuns.position.set(iconShip.width + druid.INDENT, iconShip.y);
        this.content.addChild(cardGuns);

        const barStrength = ship.createStrengthBar(iconShip.width);
        barStrength.y = iconShip.y + iconShip.height;
        this.content.addChild(barStrength);

        const btnBack = new druid.Button(l("back"));
        btnBack.y = cardGuns.y + cardGuns.height + druid.INDENT;
        this.content.addChild(btnBack);
        this.content.pivot.set(this.content.width / 2, this.content.height / 2);
        this.addChild(this.content);
        this.setUpChildren(width, height);

        btnBack.on(druid.Button.TRIGGERED, () => this.emit(druid.Event.DONE));
    }

    setUpChildren(width: number, height: number) {
        this.content.position.set(width / 2, height / 2);
        this.txtName.position.set(width / 2, this.content.y - this.content.pivot.y - druid.INDENT);
    }
}
