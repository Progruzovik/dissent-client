import Card from "./Card";
import Ship from "../../Ship";
import { Gun } from "../../util";
import { l } from "../../../localizer";
import * as druid from "pixi-druid";
import * as PIXI from "pixi.js";

export default class ShipInfo extends druid.AbstractBranch {

    private readonly layout = new druid.HorizontalLayout(druid.Alignment.Center);

    private readonly rightPanelContent = new druid.HorizontalLayout(druid.Alignment.Center);
    private readonly rightPanel = new druid.Rectangle(200, 0, 0xffffff);

    private static createGunCard(gun: Gun): Card {
        const gunSprite = new PIXI.Sprite(PIXI.loader.resources[gun.texture.name].texture);
        gunSprite.scale.set(4, 4);
        return new Card(l(gun.name), gunSprite);
    }

    constructor(ship: Ship) {
        super();
        const txtName = new PIXI.Text(ship.hull.name, { fill: "white", fontSize: 32, fontWeight: "bold" });
        this.layout.addElement(txtName);

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
        if (ship.firstGun) {
            const firstGunCard: Card = ShipInfo.createGunCard(ship.firstGun);
            layoutShip.addElement(firstGunCard);
            firstGunCard.on(druid.Event.MOUSE_UP, () => this.showRightPanelWithGun(ship.firstGun));
        }
        if (ship.secondGun) {
            const secondGunCard: Card = ShipInfo.createGunCard(ship.secondGun);
            layoutShip.addElement(secondGunCard);
            secondGunCard.on(druid.Event.MOUSE_UP, () => this.showRightPanelWithGun(ship.secondGun));
        }
        layoutContent.addElement(layoutShip);

        const btnBack = new druid.Button(`< ${l("back")}`);
        layoutContent.addElement(btnBack);
        this.layout.addElement(layoutContent);
        this.layout.pivot.set(this.layout.width / 2, this.layout.height / 2);
        this.addChild(this.layout);

        this.rightPanelContent.x = this.rightPanel.width / 2;
        this.rightPanel.addChild(this.rightPanelContent);
        this.rightPanel.pivot.x = this.rightPanel.width;

        btnBack.on(druid.Button.TRIGGERED, () => this.emit(druid.Event.DONE));
    }

    setUpChildren(width: number, height: number): void {
        this.layout.position.set(width / 2, height / 2);

        this.rightPanelContent.y = height / 2;
        this.rightPanel.height = height;
        this.rightPanel.x = width;
    }

    private showRightPanelWithGun(gun: Gun) {
        this.rightPanelContent.removeElements();
        this.rightPanelContent.addElement(new PIXI.Text(l(gun.name),
            { fontSize: 38, fontStyle: "bold", wordWrap: true, wordWrapWidth: this.rightPanel.width }));
        const textStyle = { wordWrap: true, wordWrapWidth: this.rightPanel.width };
        this.rightPanelContent.addElement(new PIXI.Text(`${l("type")}: ${l(gun.typeName)}`, textStyle));
        this.rightPanelContent.addElement(
            new PIXI.Text(`${l("shotCost")}: ${gun.shotCost} ${l("ap")}`, textStyle));
        this.rightPanelContent.addElement(new PIXI.Text(`${l("Damage")}: ${gun.damage}`, textStyle));
        this.rightPanelContent.addElement(new PIXI.Text(`${l("radius")}: ${gun.radius}`, textStyle));
        this.rightPanelContent.pivot.set(this.rightPanelContent.width / 2, this.rightPanelContent.height / 2);
        if (this.rightPanel.parent != this) {
            this.addChild(this.rightPanel);
        }
    }
}
