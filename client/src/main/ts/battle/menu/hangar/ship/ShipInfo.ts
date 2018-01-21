import Ship from "../../../Ship";
import { l } from "../../../../localizer";
import * as druid from "pixi-druid";
import * as PIXI from "pixi.js";

export default class ShipInfo extends druid.HorizontalLayout {

    constructor(ship: Ship) {
        super(druid.Alignment.Center);
        const txtName = new PIXI.Text(ship.hull.name, { fill: "white", fontSize: 32, fontWeight: "bold" });
        this.addElement(txtName);

        const layoutContent = new druid.HorizontalLayout();
        const txtAp = new PIXI.Text(`${l("ap")}: ${ship.hull.actionPoints}`,
            { fill: "white", fontSize: 24 });
        layoutContent.addElement(txtAp);
        const layoutShip = new druid.VerticalLayout();
        const layoutIcon = new druid.HorizontalLayout(druid.Alignment.Left,0);
        const iconShip = ship.createSprite();
        iconShip.scale.set(2, 2);
        layoutIcon.addElement(iconShip);
        layoutIcon.addElement(ship.createStrengthBar(iconShip.width));
        layoutShip.addElement(layoutIcon);
        layoutShip.addElement(ship.createGunsCard());
        layoutContent.addElement(layoutShip);

        const btnBack = new druid.Button(l("back"));
        layoutContent.addElement(btnBack);
        this.addElement(layoutContent);

        btnBack.on(druid.Button.TRIGGERED, () => this.emit(druid.Event.DONE));
    }
}
