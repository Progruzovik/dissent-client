import Unit from "./unit/Unit";
import UnitService from "./unit/UnitService";
import { postTurn } from "./request";
import * as game from "../game";

export default class Controls extends PIXI.Container {

    private static readonly SECTIONS_COUNT = 6;
    private static readonly SECTION_RATIO = 3;
    private static readonly EMPTY_SLOT = "(пусто)";

    private readonly spriteHull = new PIXI.Sprite();
    private readonly bgHull = new game.Rectangle(0x333333);
    private readonly bgStats = new game.Rectangle();
    private readonly btnFirstGun = new game.Button();
    private readonly btnSecondGun = new game.Button();
    private readonly bgModule = new game.Rectangle();
    private readonly btnNextTurn = new game.Button("Конец хода");

    constructor(private readonly unitService: UnitService) {
        super();
        this.spriteHull.anchor.set(game.CENTER, game.CENTER);
        this.bgHull.addChild(this.spriteHull);
        this.addChild(this.bgHull);
        this.addChild(this.bgStats);
        this.addChild(this.btnFirstGun);
        this.addChild(this.btnSecondGun);
        this.addChild(this.bgModule);
        this.addChild(this.btnNextTurn);

        this.unitService.on(Unit.SHOT, (unit: Unit) => this.updateControls(unit));
        this.unitService.on(UnitService.NEXT_TURN, (currentUnit: Unit) => this.updateControls(currentUnit));
        this.btnFirstGun.on(game.Event.BUTTON_CLICK, () =>
            unitService.currentUnit.makeGunPrepared(unitService.currentUnit.firstGun));
        this.btnSecondGun.on(game.Event.BUTTON_CLICK, () =>
            unitService.currentUnit.makeGunPrepared(unitService.currentUnit.secondGun));
        this.btnNextTurn.on(game.Event.BUTTON_CLICK, () => postTurn(() => unitService.nextTurn()));
    }

    lockInterface() {
        this.btnFirstGun.isEnabled = false;
        this.btnSecondGun.isEnabled = false;
        this.btnNextTurn.isEnabled = false;
    }

    resize(width: number) {
        const lengthPerSection: number = width / Controls.SECTIONS_COUNT;

        this.bgHull.width = lengthPerSection;
        this.bgHull.height = this.bgHull.width / Controls.SECTION_RATIO;
        const shipRatio: number = this.bgHull.height / Unit.HEIGHT;
        this.spriteHull.scale.set(shipRatio, shipRatio);
        this.spriteHull.position.set(this.bgHull.width / 2, this.bgHull.height / 2);

        this.bgStats.width = lengthPerSection;
        this.bgStats.height = this.bgStats.width / Controls.SECTION_RATIO;
        this.bgStats.x = this.bgHull.width;
        this.btnFirstGun.width = lengthPerSection;
        this.btnFirstGun.height = this.btnFirstGun.width / Controls.SECTION_RATIO;
        this.btnFirstGun.x = this.bgStats.x + this.bgStats.width;
        this.btnSecondGun.width = lengthPerSection;
        this.btnSecondGun.height = this.btnSecondGun.width / Controls.SECTION_RATIO;
        this.btnSecondGun.x = this.btnFirstGun.x + this.btnFirstGun.width;
        this.bgModule.width = lengthPerSection;
        this.bgModule.height = this.bgModule.width / Controls.SECTION_RATIO;
        this.bgModule.x = this.btnSecondGun.x + this.btnSecondGun.width;
        this.btnNextTurn.width = lengthPerSection;
        this.btnNextTurn.height = this.btnNextTurn.width / Controls.SECTION_RATIO;
        this.btnNextTurn.x = this.bgModule.x + this.bgModule.width;
    }

    private updateControls(unit: Unit) {
        this.spriteHull.texture = unit.hull.texture;
        if (unit.firstGun) {
            this.btnFirstGun.text = unit.firstGun.name;
            if (unit.firstGunCooldown > 0) {
                this.btnFirstGun.text += " (" + unit.firstGunCooldown + ")";
                this.btnFirstGun.isEnabled = false;
            } else {
                this.btnFirstGun.isEnabled = true;
            }
        } else {
            this.btnFirstGun.text = Controls.EMPTY_SLOT;
            this.btnFirstGun.isEnabled = false;
        }
        if (unit.secondGun) {
            this.btnSecondGun.text = unit.secondGun.name;
            if (unit.secondGunCooldown > 0) {
                this.btnSecondGun.text += " (" + unit.secondGunCooldown + ")";
                this.btnSecondGun.isEnabled = false;
            } else {
                this.btnSecondGun.isEnabled = true;
            }
        } else {
            this.btnSecondGun.text = Controls.EMPTY_SLOT;
            this.btnSecondGun.isEnabled = false;
        }
        this.btnNextTurn.isEnabled = true;
    }
}
