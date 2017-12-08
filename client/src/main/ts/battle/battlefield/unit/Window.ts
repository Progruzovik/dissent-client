import Unit from "./Unit";
import * as game from "../../../game";

export default class Window extends game.UiLayer {

    static readonly WIDTH = 200;
    static readonly HEIGHT = 55;

    private readonly bgWindow = new game.Rectangle(Window.WIDTH, Window.HEIGHT, 0x333333);
    private readonly barStrength = new game.ProgressBar(this.bgWindow.width, 15, 0xff0000);

    constructor(private readonly isLeft: boolean, readonly unit: Unit) {
        super();
        const txtHull = new PIXI.Text(unit.hull.name, { fill: 0xffffff, fontSize: 24 });
        txtHull.anchor.x = game.CENTER;
        txtHull.x = this.bgWindow.width / 2;
        this.bgWindow.addChild(txtHull);
        this.barStrength.maximum = unit.hull.strength;
        this.barStrength.y = txtHull.height;
        this.bgWindow.addChild(this.barStrength);
        this.addChild(this.bgWindow);
        this.updateStats();

        unit.on(Unit.UPDATE_STATS, () => this.updateStats());
    }

    resize(width: number, height: number) {
        if (!this.isLeft) {
            this.bgWindow.x = width - this.bgWindow.width;
        }
    }

    destroy(options?: PIXI.DestroyOptions | boolean ) {
        this.unit.off(Unit.UPDATE_STATS);
        super.destroy(options);
    }

    private updateStats() {
        this.barStrength.value = this.unit.strength;
        this.barStrength.text = `${this.barStrength.value}/${this.barStrength.maximum}`;
    }
}
