import Unit from "./unit/Unit";
import UnitManager from "./unit/UnitManager";
import * as game from "../game";

export default class Controls extends PIXI.Container {

    private static readonly SECTIONS_COUNT = 6;
    private static readonly SECTION_RATIO = 3;

    private readonly ship = new game.Rectangle();
    private readonly stats = new game.Rectangle();
    private readonly btnFirstGun = new game.Button();
    private readonly btnSecondGun = new game.Button();
    private readonly module = new game.Rectangle();
    private readonly btnNextTurn = new game.Button("Конец хода");

    constructor(private readonly unitManager: UnitManager) {
        super();
        this.addChild(this.ship);
        this.addChild(this.stats);
        this.addChild(this.btnFirstGun);
        this.addChild(this.btnSecondGun);
        this.addChild(this.module);
        this.addChild(this.btnNextTurn);
        this.updateGunButtons(unitManager.currentUnit);

        this.unitManager.on(Unit.SHOT, (unit: Unit) => {
            if (unit.preparedGun == unit.firstGun) {
                this.btnFirstGun.isEnabled = false;
            } else if (unit.preparedGun == unit.secondGun) {
                this.btnSecondGun.isEnabled = false;
            }
        });
        this.unitManager.on(UnitManager.NEXT_TURN, (currentUnit: Unit) => this.updateGunButtons(currentUnit));
        this.btnFirstGun.on(game.Event.BUTTON_CLICK, () => {
            if (unitManager.currentUnit.preparedGun == unitManager.currentUnit.firstGun) {
                unitManager.currentUnit.preparedGun = null;
            } else {
                unitManager.currentUnit.preparedGun = unitManager.currentUnit.firstGun;
            }
        });
        this.btnSecondGun.on(game.Event.BUTTON_CLICK, () => {
            if (unitManager.currentUnit.preparedGun == unitManager.currentUnit.secondGun) {
                unitManager.currentUnit.preparedGun = null;
            } else {
                unitManager.currentUnit.preparedGun = unitManager.currentUnit.secondGun;
            }
        });
        this.btnNextTurn.on(game.Event.BUTTON_CLICK, () => unitManager.nextTurn());
    }

    resize(width: number) {
        const lengthPerSection: number = width / Controls.SECTIONS_COUNT;
        this.ship.width = lengthPerSection;
        this.ship.height = this.ship.width / Controls.SECTION_RATIO;
        this.stats.width = lengthPerSection;
        this.stats.height = this.stats.width / Controls.SECTION_RATIO;
        this.stats.x = this.ship.width;
        this.btnFirstGun.width = lengthPerSection;
        this.btnFirstGun.height = this.btnFirstGun.width / Controls.SECTION_RATIO;
        this.btnFirstGun.x = this.stats.x + this.stats.width;
        this.btnSecondGun.width = lengthPerSection;
        this.btnSecondGun.height = this.btnSecondGun.width / Controls.SECTION_RATIO;
        this.btnSecondGun.x = this.btnFirstGun.x + this.btnFirstGun.width;
        this.module.width = lengthPerSection;
        this.module.height = this.module.width / Controls.SECTION_RATIO;
        this.module.x = this.btnSecondGun.x + this.btnSecondGun.width;
        this.btnNextTurn.width = lengthPerSection;
        this.btnNextTurn.height = this.btnNextTurn.width / Controls.SECTION_RATIO;
        this.btnNextTurn.x = this.module.x + this.module.width;
    }

    private updateGunButtons(currentUnit: Unit) {
        if (currentUnit.firstGun) {
            this.btnFirstGun.text = currentUnit.firstGun.name;
            this.btnFirstGun.isEnabled = true;
        } else {
            this.btnFirstGun.text = null;
            this.btnFirstGun.isEnabled = false;
        }
        if (currentUnit.secondGun) {
            this.btnSecondGun.text = currentUnit.secondGun.name;
            this.btnSecondGun.isEnabled = true;
        } else {
            this.btnSecondGun.text = null;
            this.btnSecondGun.isEnabled = false;
        }
    }
}
