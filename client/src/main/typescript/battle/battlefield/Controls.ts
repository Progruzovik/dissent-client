import Unit from "./unit/Unit";
import UnitService from "./unit/UnitService";
import { postTurn } from "../request";
import { MOVE, NEXT_TURN, SHOT } from "../util";
import * as game from "../../game";

export default class Controls extends game.UiElement {

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

        this.unitService.on(MOVE, () => this.updateInterface());
        this.unitService.on(SHOT, () => this.updateInterface());
        this.unitService.on(NEXT_TURN, () => this.updateInterface());
        this.btnFirstGun.on(game.Event.BUTTON_CLICK, () => {
            if (unitService.currentUnit.preparedGunId == unitService.currentUnit.firstGun.id) {
                unitService.currentUnit.preparedGunId = -1;
            } else {
                unitService.currentUnit.preparedGunId = unitService.currentUnit.firstGun.id;
            }
        });
        this.btnSecondGun.on(game.Event.BUTTON_CLICK, () => {
            if (unitService.currentUnit.preparedGunId == unitService.currentUnit.secondGun.id) {
                unitService.currentUnit.preparedGunId = -1;
            } else {
                unitService.currentUnit.preparedGunId = unitService.currentUnit.secondGun.id;
            }
        });
        this.btnNextTurn.on(game.Event.BUTTON_CLICK, postTurn);
    }

    resize(width: number, height: number) {
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

    lockInterface() {
        this.btnFirstGun.isEnabled = false;
        this.btnSecondGun.isEnabled = false;
        this.btnNextTurn.isEnabled = false;
    }

    private updateInterface() {
        const currentUnit: Unit = this.unitService.currentUnit;
        this.spriteHull.texture = PIXI.loader.resources[currentUnit.hull.texture.name].texture;
        if (currentUnit.firstGun) {
            this.btnFirstGun.text = currentUnit.firstGun.name;
            if (currentUnit.firstGunCooldown > 0) {
                this.btnFirstGun.text += " (" + currentUnit.firstGunCooldown + ")";
                this.btnFirstGun.isEnabled = false;
            } else {
                this.btnFirstGun.isEnabled = this.unitService.isCurrentPlayerTurn;
            }
        } else {
            this.btnFirstGun.text = Controls.EMPTY_SLOT;
            this.btnFirstGun.isEnabled = false;
        }
        if (currentUnit.secondGun) {
            this.btnSecondGun.text = currentUnit.secondGun.name;
            if (currentUnit.secondGunCooldown > 0) {
                this.btnSecondGun.text += " (" + currentUnit.secondGunCooldown + ")";
                this.btnSecondGun.isEnabled = false;
            } else {
                this.btnSecondGun.isEnabled = this.unitService.isCurrentPlayerTurn;
            }
        } else {
            this.btnSecondGun.text = Controls.EMPTY_SLOT;
            this.btnSecondGun.isEnabled = false;
        }
        this.btnNextTurn.isEnabled = this.unitService.isCurrentPlayerTurn;
    }
}
