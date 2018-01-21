import Field from "./Field";
import Unit from "../unit/Unit";
import UnitService from "../unit/UnitService";
import WebSocketClient from "../../WebSocketClient";
import { ActionType, Gun } from "../../util";
import { l } from "../../../localizer";
import * as druid from "pixi-druid";

export default class Controls extends druid.AbstractBranch {

    private static readonly SECTIONS_COUNT = 6;
    private static readonly SECTION_RATIO = 3;

    private readonly txtLog = new PIXI.Text("", { fill: "white", fontSize: 18, wordWrap: true });

    private readonly spriteHull = new PIXI.Sprite();
    private readonly frameUnit = new druid.Frame();
    private readonly bgHull = new druid.Rectangle(0, 0, 0x333333);

    private readonly barStrength = new druid.ProgressBar(0,
        0, 0xff0000, druid.BarTextConfig.Default);
    private readonly bgStats = new PIXI.Container();

    private readonly btnFirstGun = new druid.Button();
    private readonly btnSecondGun = new druid.Button();
    private readonly bgModule = new druid.Rectangle();
    private readonly btnNextTurn = new druid.Button(l("endTurn"));
    private readonly layoutButtons = new druid.VerticalLayout(0);

    constructor(private readonly unitService: UnitService, webSocketClient: WebSocketClient) {
        super();
        this.txtLog.anchor.y = 1;
        this.addChild(this.txtLog);

        this.spriteHull.anchor.set(druid.CENTER, druid.CENTER);
        this.bgHull.addChild(this.spriteHull);
        this.bgHull.addChild(this.frameUnit);
        this.layoutButtons.addElement(this.bgHull);

        this.bgStats.addChild(this.barStrength);
        this.layoutButtons.addElement(this.bgStats);

        this.layoutButtons.addElement(this.btnFirstGun);
        this.layoutButtons.addElement(this.btnSecondGun);
        this.layoutButtons.addElement(this.bgModule);
        this.layoutButtons.addElement(this.btnNextTurn);
        this.addChild(this.layoutButtons);

        unitService.on(ActionType.Move, () => this.updateInterface());
        unitService.on(ActionType.Shot, (unit: Unit, gun: Gun, target: Unit, damage: number) => {
            this.txtLog.text = `${target.ship.hull.name} ${l("hitBy")} ${unit.ship.hull.name} ${l("with")} `
                + `${l(gun.name)} ${l("for")} ${damage} ${l("damage")}`;
            this.updateInterface();
        });
        unitService.on(ActionType.NextTurn, () => this.updateInterface());
        this.btnFirstGun.on(druid.Button.TRIGGERED, () =>
            unitService.activeUnit.preparedGunId = unitService.activeUnit.ship.firstGun.id);
        this.btnSecondGun.on(druid.Button.TRIGGERED, () =>
            unitService.activeUnit.preparedGunId = unitService.activeUnit.ship.secondGun.id);
        this.btnNextTurn.on(druid.Button.TRIGGERED, () => webSocketClient.endTurn());
    }

    get buttonsHeight(): number {
        return this.layoutButtons.height;
    }

    get fullBottomHeight(): number {
        return this.txtLog.height + this.layoutButtons.height;
    }

    lockInterface() {
        this.btnFirstGun.isEnabled = false;
        this.btnSecondGun.isEnabled = false;
        this.btnNextTurn.isEnabled = false;
    }

    setUpChildren(width: number, height: number) {
        const sectionWidth = width / Controls.SECTIONS_COUNT, sectionHeight = sectionWidth / Controls.SECTION_RATIO;
        this.txtLog.style.wordWrapWidth = sectionWidth;
        this.txtLog.x = sectionWidth * (Controls.SECTIONS_COUNT - 1);

        this.bgHull.width = sectionWidth;
        this.bgHull.height = sectionHeight;
        const shipRatio = this.bgHull.height / Field.CELL_SIZE.y;
        this.spriteHull.scale.set(shipRatio, shipRatio);
        this.spriteHull.position.set(this.bgHull.width / 2, this.bgHull.height / 2);
        this.frameUnit.width = sectionWidth;
        this.frameUnit.height = sectionHeight;

        this.barStrength.txtMain.style = new PIXI.TextStyle({ fill: "white", fontSize: 26, fontWeight: "bold" });
        this.barStrength.width = sectionWidth;
        this.barStrength.height = sectionHeight / 3;
        this.barStrength.y = sectionHeight / 3;

        this.btnFirstGun.width = sectionWidth;
        this.btnFirstGun.height = sectionHeight;
        this.btnSecondGun.width = sectionWidth;
        this.btnSecondGun.height = sectionHeight;
        this.bgModule.width = sectionWidth;
        this.bgModule.height = sectionHeight;

        this.btnNextTurn.txtMain.style = new PIXI.TextStyle({ align: "center",
            fill: "white", fontSize: 32, fontWeight: "bold", stroke: "red", strokeThickness: 1.4 });
        this.btnNextTurn.width = sectionWidth;
        this.btnNextTurn.height = sectionHeight;
        this.layoutButtons.updateElements();
        this.layoutButtons.pivot.y = this.layoutButtons.height;
        this.layoutButtons.y = height;

        this.txtLog.y = height - this.buttonsHeight - druid.INDENT / 2;
    }

    private updateInterface() {
        const activeUnit: Unit = this.unitService.activeUnit;
        this.spriteHull.texture = PIXI.loader.resources[activeUnit.ship.hull.texture.name].texture;
        this.frameUnit.color = activeUnit.frameColor;
        this.barStrength.maximum = activeUnit.ship.hull.strength;
        this.barStrength.value = activeUnit.strength;
        this.updateBtnGun(this.btnFirstGun, activeUnit.ship.firstGun);
        this.updateBtnGun(this.btnSecondGun, activeUnit.ship.secondGun);
        this.btnNextTurn.isEnabled = this.unitService.isCurrentPlayerTurn;
    }

    private updateBtnGun(btnGun: druid.Button, gun: Gun) {
        if (gun) {
            btnGun.isEnabled = this.unitService.isCurrentPlayerTurn
                && this.unitService.activeUnit.actionPoints >= gun.shotCost;
            btnGun.text = `${l(gun.name)}\n(${gun.shotCost} ${l("ap")})`;
        } else {
            btnGun.isEnabled = false;
            btnGun.text = `[${l("empty")}]`;
        }
    }
}
