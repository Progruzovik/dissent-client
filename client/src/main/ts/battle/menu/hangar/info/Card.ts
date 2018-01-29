import InteractiveContainer from "../../../ui/InteractiveContainer";
import * as druid from "pixi-druid";
import * as PIXI from "pixi.js";

export default class Card extends InteractiveContainer {

    constructor(name: string, img: PIXI.Sprite) {
        super(150, 110, 0x00ff00);
        this.addChild(new druid.Rectangle(this.width, this.height, 0xdedede));
        const layout = new druid.HorizontalLayout(druid.Alignment.Left, 0);
        layout.addElement(new PIXI.Text(name, { fontSize: 20, fontWeight: "bold" }));
        layout.addElement(img);
        layout.pivot.set(layout.width / 2, layout.height / 2);
        layout.position.set(this.width / 2, this.height / 2);
        this.addChild(layout);
    }
}
