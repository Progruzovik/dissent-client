import Field from "./Field";
import Unit from "./unit/Unit";
import UnitService from "./unit/UnitService";
import WebSocketConnection from "../WebSocketConnection";
import { ActionType } from "../util";
import * as game from "../../game";

export default class Controls extends game.UiLayer {

    private static readonly SECTIONS_COUNT = 6;
    private static readonly SECTION_RATIO = 3;
    private static readonly EMPTY_SLOT = "[пусто]";

    private readonly spriteHull = new PIXI.Sprite();
    private readonly bgHull = new game.Rectangle(0, 0, 0x333333);

    private readonly barStrength = new game.ProgressBar(0, 0, 0xff0000,
        100, 0, { fill: "white", fontSize: 26, fontWeight: "bold" });
    private readonly bgStats = new PIXI.Container();

    private readonly btnFirstGun = new game.Button();
    private readonly btnSecondGun = new game.Button();
    private readonly bgModule = new game.Rectangle(0, 0);
    private readonly btnNextTurn = new game.Button("Конец хода", { align: "center",
        fill: "white", fontSize: 32, fontWeight: "bold", stroke: "red", strokeThickness: 1.4 });

    constructor(private readonly unitService: UnitService, webSocketConnection: WebSocketConnection) {
        super();
        this.spriteHull.anchor.set(game.CENTER, game.CENTER);
        this.bgHull.addChild(this.spriteHull);
        this.addChild(this.bgHull);

        this.bgStats.addChild(this.barStrength);
        this.addChild(this.bgStats);

        this.addChild(this.btnFirstGun);
        this.addChild(this.btnSecondGun);
        this.addChild(this.bgModule);
        this.addChild(this.btnNextTurn);

        unitService.on(ActionType.Move, () => this.updateInterface());
        unitService.on(ActionType.Shot, () => this.updateInterface());
        unitService.on(ActionType.NextTurn, () => this.updateInterface());
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
        this.btnNextTurn.on(game.Event.BUTTON_CLICK, () => webSocketConnection.endTurn());
    }

    resize(width: number, height: number) {
        const widthPerSection = width / Controls.SECTIONS_COUNT;
        const heightPerSection = widthPerSection / Controls.SECTION_RATIO;

        this.bgHull.width = widthPerSection;
        this.bgHull.height = heightPerSection;
        const shipRatio = this.bgHull.height / Field.CELL_SIZE.y;
        this.spriteHull.scale.set(shipRatio, shipRatio);
        this.spriteHull.position.set(this.bgHull.width / 2, this.bgHull.height / 2);

        this.barStrength.width = widthPerSection;
        this.barStrength.height = heightPerSection / 3;
        this.barStrength.pivot.y = this.barStrength.height / 2;
        this.barStrength.y = heightPerSection / 2;
        this.bgStats.x = widthPerSection;

        this.btnFirstGun.width = widthPerSection;
        this.btnFirstGun.height = heightPerSection;
        this.btnFirstGun.x = widthPerSection * 2;
        this.btnSecondGun.width = widthPerSection;
        this.btnSecondGun.height = heightPerSection;
        this.btnSecondGun.x = widthPerSection * 3;
        this.bgModule.width = widthPerSection;
        this.bgModule.height = heightPerSection;
        this.bgModule.x = widthPerSection * 4;
        this.btnNextTurn.width = widthPerSection;
        this.btnNextTurn.height = heightPerSection;
        this.btnNextTurn.x = widthPerSection * 5;
    }

    lockInterface() {
        this.btnFirstGun.isEnabled = false;
        this.btnSecondGun.isEnabled = false;
        this.btnNextTurn.isEnabled = false;
    }

    private updateInterface() {
        const currentUnit: Unit = this.unitService.currentUnit;
        this.spriteHull.texture = PIXI.loader.resources[currentUnit.hull.texture.name].texture;
        this.barStrength.maximum = currentUnit.hull.strength;
        this.barStrength.value = currentUnit.strength;
        this.barStrength.text = `${this.barStrength.value}/${this.barStrength.maximum}`;
        if (currentUnit.firstGun) {
            this.btnFirstGun.text = `${currentUnit.firstGun.name}\n(${currentUnit.firstGun.shotCost} ОД)`;
            this.btnFirstGun.isEnabled = this.unitService.isCurrentPlayerTurn
                && currentUnit.actionPoints >= currentUnit.firstGun.shotCost;
        } else {
            this.btnFirstGun.text = Controls.EMPTY_SLOT;
            this.btnFirstGun.isEnabled = false;
        }
        if (currentUnit.secondGun) {
            this.btnSecondGun.text = `${currentUnit.secondGun.name}\n(${currentUnit.secondGun.shotCost} ОД)`;
            this.btnSecondGun.isEnabled = this.unitService.isCurrentPlayerTurn
                && currentUnit.actionPoints >= currentUnit.secondGun.shotCost;
        } else {
            this.btnSecondGun.text = Controls.EMPTY_SLOT;
            this.btnSecondGun.isEnabled = false;
        }
        this.btnNextTurn.isEnabled = this.unitService.isCurrentPlayerTurn;
    }
}
