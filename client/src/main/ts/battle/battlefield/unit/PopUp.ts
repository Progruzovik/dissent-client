import Unit from "./Unit";
import { Side } from "../../util";
import * as druid from "pixi-druid";

export default class PopUp extends druid.AbstractBranch {

    static readonly WIDTH = 200;
    static readonly HEIGHT = 105;

    private readonly lineToWindow = new druid.Line(1, this.unit.frameColor);

    private readonly bgWindow = new druid.Rectangle(PopUp.WIDTH, PopUp.HEIGHT, 0x333333);
    private readonly barStrength = this.unit.ship.createStrengthBar(this.bgWindow.width);

    constructor(rootWidth: number, rootHeight: number, readonly unit: Unit) {
        super();
        const unitBounds: PIXI.Rectangle = unit.getBounds(true);
        this.lineToWindow.position.set(unitBounds.x + unitBounds.width / 2, unitBounds.y);
        this.addChild(this.lineToWindow);

        const txtTitle = new PIXI.Text(unit.ship.hull.name, { fill: 0xffffff, fontSize: 24 });
        txtTitle.anchor.x = druid.CENTER;
        txtTitle.x = this.bgWindow.width / 2;
        this.bgWindow.addChild(txtTitle);
        const unitIcon = unit.ship.createSprite();
        unitIcon.pivot.x = unitIcon.width / 2;
        unitIcon.x = this.bgWindow.width / 2;
        unitIcon.y = txtTitle.height;
        this.bgWindow.addChild(unitIcon);
        this.barStrength.y = unitIcon.y + unitIcon.height + 5;
        this.bgWindow.addChild(this.barStrength);
        const frame = new druid.Frame(this.bgWindow.width, this.bgWindow.height, 1, unit.frameColor);
        this.bgWindow.addChild(frame);
        this.addChild(this.bgWindow);
        this.setUpChildren(rootWidth, rootHeight);

        unit.on(Unit.UPDATE_STATS, () => this.updateStats());
    }

    setUpChildren(width: number, height: number) {
        if (this.unit.side == Side.Left) {
            this.bgWindow.x = druid.INDENT / 2;
        } else if (this.unit.side == Side.Right) {
            this.bgWindow.x = width - this.bgWindow.width - druid.INDENT / 2;
        }
        this.bgWindow.y = druid.INDENT / 2;
        this.lineToWindow.directTo(this.bgWindow.x + this.bgWindow.width / 2,
            this.bgWindow.y + this.bgWindow.height);
    }

    destroy(options?: PIXI.DestroyOptions | boolean ) {
        this.unit.off(Unit.UPDATE_STATS);
        super.destroy(options);
    }

    private updateStats() {
        this.barStrength.value = this.unit.strength;
    }
}
