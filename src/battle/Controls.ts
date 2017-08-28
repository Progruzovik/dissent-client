import Unit from "./unit/Unit";
import UnitManager from "./unit/UnitManager";
import * as game from "../game";

export default class Controls extends PIXI.Container {

    private static readonly SECTIONS_COUNT = 6;
    private static readonly SECTION_RATIO = 3;

    private readonly spriteShip = new PIXI.Sprite();
    private readonly bgShip = new game.Rectangle();
    private readonly bgStats = new game.Rectangle();
    private readonly btnFirstGun = new game.Button();
    private readonly btnSecondGun = new game.Button();
    private readonly bgModule = new game.Rectangle();
    private readonly btnNextTurn = new game.Button("Конец хода");

    constructor(private readonly unitManager: UnitManager) {
        super();
        this.spriteShip.anchor.set(game.CENTER, game.CENTER);
        this.bgShip.addChild(this.spriteShip);
        this.addChild(this.bgShip);
        this.addChild(this.bgStats);
        this.addChild(this.btnFirstGun);
        this.addChild(this.btnSecondGun);
        this.addChild(this.bgModule);
        this.addChild(this.btnNextTurn);
        this.updateControls(unitManager.currentUnit);

        this.unitManager.on(Unit.SHOT, (unit: Unit) => {
            if (unit.preparedGun == unit.firstGun) {
                this.btnFirstGun.isEnabled = false;
            } else if (unit.preparedGun == unit.secondGun) {
                this.btnSecondGun.isEnabled = false;
            }
        });
        this.unitManager.on(UnitManager.NEXT_TURN, (currentUnit: Unit) => this.updateControls(currentUnit));
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

        this.bgShip.width = lengthPerSection;
        this.bgShip.height = this.bgShip.width / Controls.SECTION_RATIO;
        const shipRatio: number = this.bgShip.height / Unit.HEIGHT;
        this.spriteShip.scale.set(shipRatio, shipRatio);
        this.spriteShip.position.set(this.bgShip.width / 2, this.bgShip.height / 2);

        this.bgStats.width = lengthPerSection;
        this.bgStats.height = this.bgStats.width / Controls.SECTION_RATIO;
        this.bgStats.x = this.bgShip.width;
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

    private updateControls(currentUnit: Unit) {
        this.spriteShip.texture = currentUnit.ship.texture;
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
