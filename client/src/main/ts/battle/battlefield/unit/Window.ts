import Unit from "./Unit";
import { Side } from "../../util";
import * as game from "../../../game";

export default class Window extends game.UiLayer {

    static readonly WIDTH = 200;
    static readonly HEIGHT = 105;

    private readonly lineToWindow = new game.Line(0, 1, this.unit.frameColor);

    private readonly bgWindow = new game.Rectangle(Window.WIDTH, Window.HEIGHT, 0x333333);
    private readonly barStrength = new game.ProgressBar(this.bgWindow.width, 15, 0xff0000);

    constructor(playerSide: Side, readonly unit: Unit) {
        super();

        const unitBounds: PIXI.Rectangle = unit.getBounds(true);
        this.lineToWindow.position.set(unitBounds.x + unitBounds.width / 2, unitBounds.y);
        this.addChild(this.lineToWindow);

        const txtTitle = new PIXI.Text(unit.hull.name, { fill: 0xffffff, fontSize: 24 });
        txtTitle.anchor.x = game.CENTER;
        txtTitle.x = this.bgWindow.width / 2;
        this.bgWindow.addChild(txtTitle);
        const unitIcon = unit.createIcon();
        unitIcon.pivot.x = unitIcon.width / 2;
        unitIcon.x = this.bgWindow.width / 2;
        unitIcon.y = txtTitle.height;
        this.bgWindow.addChild(unitIcon);
        this.barStrength.maximum = unit.hull.strength;
        this.barStrength.y = unitIcon.y + unitIcon.height + 5;
        this.bgWindow.addChild(this.barStrength);
        this.bgWindow.addChild(new game.Frame(this.bgWindow.width, this.bgWindow.height, 1, unit.frameColor));
        this.addChild(this.bgWindow);
        this.updateStats();

        unit.on(Unit.UPDATE_STATS, () => this.updateStats());
    }

    resize(width: number, height: number) {
        if (this.unit.side == Side.Left) {
            this.bgWindow.x = game.INDENT / 2;
        } else if (this.unit.side == Side.Right) {
            this.bgWindow.x = width - this.bgWindow.width - game.INDENT / 2;
        }
        this.bgWindow.y = game.INDENT / 2;
        const to = new game.Point(this.bgWindow.x + this.bgWindow.width / 2, this.bgWindow.y + this.bgWindow.height);
        this.lineToWindow.direct(to);
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
