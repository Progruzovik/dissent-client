import { Gun } from "../../../util";
import { l } from "../../../../localizer";
import * as druid from "pixi-druid";
import * as PIXI from "pixi.js";

export default class RightPanel extends druid.Rectangle implements druid.SizeAware {

    private readonly content = new druid.HorizontalLayout(druid.Alignment.Center);

    constructor() {
        super(0, 0, 0xffffff);
        this.addChild(this.content);
    }

    setUpChildren(width: number, height: number): void {
        this.width = width / 6;
        this.height = height;
        this.content.position.set(this.width / 2, this.height / 2);
    }

    updateContent(gun: Gun) {
        this.content.removeElements();
        this.content.addElement(new PIXI.Text(l(gun.name),
            { breakWords: true, fontSize: 38, fontStyle: "bold", wordWrap: true, wordWrapWidth: this.width }));
        const textStyle = { breakWords: true, wordWrap: true, wordWrapWidth: this.width };
        this.content.addElement(new PIXI.Text(`${l("type")}: ${l(gun.typeName)}`, textStyle));
        this.content.addElement(new PIXI.Text(`${l("shotCost")}: ${gun.shotCost} ${l("ap")}`, textStyle));
        this.content.addElement(new PIXI.Text(`${l("Damage")}: ${gun.damage}`, textStyle));
        this.content.addElement(new PIXI.Text(`${l("radius")}: ${gun.radius}`, textStyle));
        this.content.pivot.set(this.content.width / 2, this.content.height / 2);
    }
}
