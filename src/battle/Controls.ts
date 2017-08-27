import Unit from "./unit/Unit";
import UnitManager from "./unit/UnitManager";
import * as game from "../game";

export default class Controls extends PIXI.Container {

    private static readonly SECTIONS_COUNT = 6;

    private readonly ship = new game.Rectangle();
    private readonly stats = new game.Rectangle();
    private readonly btnFirstGun = new game.Button("Первое орудие");
    private readonly btnSecondGun = new game.Button("Второе орудие");
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

        this.unitManager.on(Unit.SHOT, (unit: Unit) => {
            if (unit.preparedGun == unit.firstGun) {
                this.btnFirstGun.isEnabled = false;
            } else if (unit.preparedGun == unit.secondGun) {
                this.btnSecondGun.isEnabled = false;
            }
        });
        this.unitManager.on(UnitManager.NEXT_TURN, (currentUnit: Unit) => {
            this.btnFirstGun.isEnabled = currentUnit.firstGun != 0;
            this.btnSecondGun.isEnabled = currentUnit.secondGun != 0;
            this.btnNextTurn.isEnabled = true;
        });
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
        this.ship.height = this.ship.width/ 2;
        this.stats.width = lengthPerSection;
        this.stats.height = this.stats.width / 2;
        this.stats.x = this.ship.width;
        this.btnFirstGun.width = lengthPerSection;
        this.btnFirstGun.height = this.btnFirstGun.width / 2;
        this.btnFirstGun.x = this.stats.x + this.stats.width;
        this.btnSecondGun.width = lengthPerSection;
        this.btnSecondGun.height = this.btnSecondGun.width / 2;
        this.btnSecondGun.x = this.btnFirstGun.x + this.btnFirstGun.width;
        this.module.width = lengthPerSection;
        this.module.height = this.module.width / 2;
        this.module.x = this.btnSecondGun.x + this.btnSecondGun.width;
        this.btnNextTurn.width = lengthPerSection;
        this.btnNextTurn.height = this.btnNextTurn.width / 2;
        this.btnNextTurn.x = this.module.x + this.module.width;
    }
}
