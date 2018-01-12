import * as druid from "pixi-druid";
import * as PIXI from "pixi.js";

export default class Card extends druid.Rectangle {

    constructor(name: string, img: PIXI.Sprite) {
        super(150, 110, 0xdedede);
        const txtName = new PIXI.Text(name, { fontSize: 20, fontWeight: "bold" });
        txtName.anchor.x = druid.CENTER;
        txtName.position.set(this.width / 2, druid.INDENT / 2);
        this.addChild(txtName);
        img.anchor.x = druid.CENTER;
        img.position.set(this.width / 2, txtName.y + druid.INDENT);
        this.addChild(img);
    }
}
