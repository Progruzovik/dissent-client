import * as game from "../../../game";
import * as PIXI from "pixi.js";

export default class Card extends game.Rectangle {

    constructor(name: string, img: PIXI.Sprite) {
        super(150, 110, 0xdedede);
        const txtName = new PIXI.Text(name, { fontSize: 20, fontWeight: "bold" });
        txtName.anchor.x = game.CENTER;
        txtName.position.set(this.width / 2, game.INDENT / 2);
        this.addChild(txtName);
        img.anchor.x = game.CENTER;
        img.position.set(this.width / 2, txtName.y + game.INDENT);
        this.addChild(img);
    }
}
