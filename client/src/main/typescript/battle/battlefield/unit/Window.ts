import Unit from "./Unit";
import * as game from "../../../game";

export default class Window extends game.Rectangle {

    constructor(unit: Unit) {
        super(200, 0, 0x333333);
        const txtUnit = new PIXI.Text(unit.hull.texture.name, { fill: 0xffffff });
        txtUnit.anchor.x = game.CENTER;
        txtUnit.x = this.width / 2;
        this.addChild(txtUnit);
        const barStrength = new game.ProgressBar(this.width, 15, 0xff0000, unit.hull.strength);
        barStrength.value = unit.strength;
        barStrength.text = `${barStrength.value}/${barStrength.maximum}`;
        barStrength.y = txtUnit.height;
        this.addChild(barStrength);
        this.height = barStrength.y + barStrength.height;
    }
}
