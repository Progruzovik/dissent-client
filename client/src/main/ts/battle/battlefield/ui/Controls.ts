import Field from "./Field";
import Unit from "../unit/Unit";
import UnitService from "../unit/UnitService";
import WebSocketClient from "../../WebSocketClient";
import { ActionType, Gun } from "../../util";
import ScalableVerticalLayout from "../../ui/ScalableVerticalLayout";
import { l } from "../../../localizer";
import * as druid from "pixi-druid";

export default class Controls extends druid.AbstractBranch {

    private readonly txtLog = new PIXI.Text("", { fill: "white", fontSize: 18, wordWrap: true });

    private readonly spriteHull = new PIXI.Sprite();
    private readonly frameUnit = new druid.Frame();
    private readonly bgHull = new druid.Rectangle(0, 0, 0x333333);

    private readonly barStrength = new druid.ProgressBar(0,
        0, 0xff0000, druid.BarTextConfig.Default);

    private readonly btnFirstGun = new druid.Button();
    private readonly btnSecondGun = new druid.Button();
    private readonly btnNextTurn = new druid.Button(l("endTurn"));
    private readonly layoutButtons = new ScalableVerticalLayout(3);

    constructor(private readonly unitService: UnitService, webSocketClient: WebSocketClient) {
        super();
        this.txtLog.anchor.y = 1;
        this.addChild(this.txtLog);

        this.spriteHull.anchor.set(0.5, 0.5);
        this.bgHull.addChild(this.spriteHull);
        this.bgHull.addChild(this.frameUnit);
        this.layoutButtons.addElement(this.bgHull);

        const bgStats = new druid.Rectangle();
        this.barStrength.txtMain.style = new PIXI.TextStyle({ fill: "white", fontSize: 26, fontWeight: "bold" });
        bgStats.addChild(this.barStrength);
        this.layoutButtons.addElement(bgStats);

        this.layoutButtons.addElement(this.btnFirstGun);
        this.layoutButtons.addElement(this.btnSecondGun);
        this.layoutButtons.addElement(new druid.Rectangle());
        this.btnNextTurn.txtMain.style = new PIXI.TextStyle({ align: "center",
            fill: "white", fontSize: 32, fontWeight: "bold", stroke: "red", strokeThickness: 1.4 });
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

    lockButtons() {
        this.btnFirstGun.isEnabled = false;
        this.btnSecondGun.isEnabled = false;
        this.btnNextTurn.isEnabled = false;
    }

    setUpChildren(width: number, height: number) {
        this.layoutButtons.setUpChildren(width, height);
        this.txtLog.style.wordWrapWidth = this.layoutButtons.elementWidth;
        this.txtLog.x = this.layoutButtons.elementWidth * (this.layoutButtons.elementsCount - 1);
        this.txtLog.y = height - this.buttonsHeight - druid.INDENT / 2;

        const shipRatio = this.bgHull.height / Field.CELL_SIZE.y;
        this.spriteHull.scale.set(shipRatio, shipRatio);
        this.spriteHull.position.set(this.bgHull.width / 2, this.bgHull.height / 2);
        this.frameUnit.width = this.layoutButtons.elementWidth;
        this.frameUnit.height = this.layoutButtons.elementHeight;

        this.barStrength.width = this.layoutButtons.elementWidth;
        this.barStrength.height = this.layoutButtons.elementHeight / 3;
        this.barStrength.y = this.layoutButtons.elementHeight / 3;

        this.layoutButtons.pivot.y = this.layoutButtons.height;
        this.layoutButtons.y = height;
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
