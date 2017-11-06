import Unit from "./Unit";
import * as game from "../../../game";

export default class Window extends game.Rectangle {

    private readonly barStrength = new game.ProgressBar(this.width, 15, 0xff0000);

    constructor(private readonly unit: Unit) {
        super(200, 0, 0x333333);
        const txtUnit = new PIXI.Text(unit.hull.texture.name, { fill: 0xffffff });
        txtUnit.anchor.x = game.CENTER;
        txtUnit.x = this.width / 2;
        this.addChild(txtUnit);
        this.barStrength.maximum = unit.hull.strength;
        this.barStrength.y = txtUnit.height;
        this.addChild(this.barStrength);
        this.updateStats();
        this.height = this.barStrength.y + this.barStrength.height;

        this.unit.on(Unit.UPDATE_STATS, () => this.updateStats());
    }

    private updateStats() {
        this.barStrength.value = this.unit.strength;
        this.barStrength.text = `${this.barStrength.value}/${this.barStrength.maximum}`;
    }
}
