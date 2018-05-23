import { Unit } from "../unit/Unit";
import { Side } from "../../../model/util";
import * as druid from "pixi-druid";

export class PopUp extends druid.AbstractBranch {

    static readonly WIDTH = 200;
    static readonly HEIGHT = 100;

    private readonly lineToWindow = new druid.Line(1, this.unit.frameColor);

    private readonly bgPopUp = new druid.Rectangle(PopUp.WIDTH, PopUp.HEIGHT, 0x333333);
    private readonly barStrength = this.unit.ship.createStrengthBar(this.bgPopUp.width);

    constructor(rootWidth: number, rootHeight: number, readonly unit: Unit) {
        super();
        const unitBounds: PIXI.Rectangle = unit.getBounds(true);
        this.lineToWindow.position.set(unitBounds.x + unitBounds.width / 2, unitBounds.y);
        this.addChild(this.lineToWindow);

        const layoutWindow = new druid.HorizontalLayout(druid.Alignment.Center, 0);
        layoutWindow.addElement(new PIXI.Text(unit.ship.hull.name, { fill: 0xffffff, fontSize: 24 }));
        layoutWindow.addElement(unit.ship.createSprite());
        layoutWindow.addElement(this.barStrength);
        this.bgPopUp.addChild(layoutWindow);
        const frame = new druid.Frame(this.bgPopUp.width, this.bgPopUp.height, unit.frameColor);
        this.bgPopUp.addChild(frame);
        this.addChild(this.bgPopUp);
        this.resize(rootWidth, rootHeight);

        unit.on(Unit.UPDATE_STATS, () => this.updateStats());
    }

    onResize() {
        if (this.unit.side == Side.Left) {
            this.bgPopUp.x = druid.INDENT / 2;
        } else if (this.unit.side == Side.Right) {
            this.bgPopUp.x = this.width - this.bgPopUp.width - druid.INDENT / 2;
        }
        this.bgPopUp.y = druid.INDENT / 2;
        this.lineToWindow.directTo(this.bgPopUp.x + this.bgPopUp.width / 2, this.bgPopUp.y + this.bgPopUp.height);
    }

    destroy(options?: PIXI.DestroyOptions | boolean ) {
        this.unit.off(Unit.UPDATE_STATS);
        super.destroy(options);
    }

    private updateStats() {
        this.barStrength.value = this.unit.strength;
    }
}
