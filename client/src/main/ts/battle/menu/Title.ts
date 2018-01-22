import * as PIXI from "pixi.js";
import * as druid from "pixi-druid";

export default class Title extends druid.AbstractBranch {

    private readonly bg = new druid.Rectangle(0, 18, 0xdedede);

    constructor() {
        super();
        this.addChild(this.bg);
        const txtTitle = new PIXI.Text("Dissent [tech demo]", { fontSize: 16, fontStyle: "italic" });
        txtTitle.x = druid.INDENT / 2;
        this.addChild(txtTitle);
    }

    setUpChildren(width: number, height: number): void {
        this.bg.width = width;
    }
}
