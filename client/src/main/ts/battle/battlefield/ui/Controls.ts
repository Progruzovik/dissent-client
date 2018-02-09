import Field from "./Field";
import Log from "./Log";
import Unit from "../unit/Unit";
import UnitService from "../unit/UnitService";
import ScalableVerticalLayout from "../../ui/ScalableVerticalLayout";
import WebSocketClient from "../../../WebSocketClient";
import { ActionType, Gun, LogEntry } from "../../../model/util";
import { l } from "../../../localizer";
import * as druid from "pixi-druid";

export default class Controls extends druid.AbstractBranch {

    private readonly log: Log;

    private readonly spriteHull = new PIXI.Sprite();
    private readonly frameUnit = new druid.Frame();
    private readonly bgHull = new druid.Rectangle(0, 0, 0x333333);

    private readonly barStrength = new druid.ProgressBar(0,
        0, 0xff0000, druid.BarTextConfig.Default);

    private readonly btnFirstGun = new GunButton(this.unitService);
    private readonly btnSecondGun = new GunButton(this.unitService);
    private readonly btnEndTurn = new druid.Button(l("endTurn"));
    private readonly layoutButtons = new ScalableVerticalLayout(3);

    constructor(log: LogEntry[], private readonly unitService: UnitService, webSocketClient: WebSocketClient) {
        super();
        this.log = new Log(log);
        this.addChild(this.log);

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
        this.btnEndTurn.txtMain.style = new PIXI.TextStyle({ align: "center",
            fill: "white", fontSize: 32, fontWeight: "bold", stroke: "red", strokeThickness: 1.4 });
        this.layoutButtons.addElement(this.btnEndTurn);
        this.addChild(this.layoutButtons);

        unitService.on(ActionType.Move, () => this.updateInterface());
        unitService.on(ActionType.Shot, (damage: number, gun: Gun, unit: Unit, target: Unit) => {
            this.log.addEntry(damage, gun.name, unit.ship.hull.name, target.ship.hull.name);
            this.updateInterface();
        });
        unitService.on(ActionType.NextTurn, () => this.updateInterface());
        this.btnEndTurn.on(druid.Button.TRIGGERED, () => webSocketClient.endTurn());
    }

    get buttonsHeight(): number {
        return this.layoutButtons.height;
    }

    get fullBottomHeight(): number {
        return this.log.height + this.layoutButtons.height;
    }

    lockButtons() {
        this.btnFirstGun.isEnabled = false;
        this.btnSecondGun.isEnabled = false;
        this.btnEndTurn.isEnabled = false;
    }

    setUpChildren(width: number, height: number) {
        this.layoutButtons.setUpChildren(width, height);

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

        const freeHeight = height - this.buttonsHeight - druid.INDENT / 2;
        this.log.setUpChildren(this.layoutButtons.elementWidth, freeHeight);
        this.log.pivot.y = this.log.height;
        this.log.position.set(this.btnEndTurn.x, freeHeight);
    }

    private updateInterface() {
        const activeUnit: Unit = this.unitService.activeUnit;
        this.spriteHull.texture = PIXI.loader.resources[activeUnit.ship.hull.texture.name].texture;
        this.frameUnit.color = activeUnit.frameColor;
        this.barStrength.maximum = activeUnit.ship.hull.strength;
        this.barStrength.value = activeUnit.strength;
        this.btnFirstGun.gun = activeUnit.ship.firstGun;
        this.btnSecondGun.gun = activeUnit.ship.secondGun;
        this.btnEndTurn.isEnabled = this.unitService.isCurrentPlayerTurn;
    }
}

class GunButton extends druid.ToggleButton {

    private _gun: Gun;

    constructor(private readonly unitService: UnitService) {
        super();
        this.on(druid.ToggleButton.TOGGLE, (isToggled: boolean) => {
            if (isToggled && this.gun) {
                unitService.activeUnit.preparedGunId = this.gun.id;
            } else {
                unitService.activeUnit.preparedGunId = Unit.NO_GUN_ID;
            }
        });
    }

    get gun(): Gun {
        return this._gun;
    }

    set gun(value: Gun) {
        this.isToggled = false;
        this._gun = value;
        if (value) {
            this.isEnabled = this.unitService.isCurrentPlayerTurn
                && this.unitService.activeUnit.actionPoints >= value.shotCost;
            this.text = `${l(value.name)}\n(${value.shotCost} ${l("ap")})`;
        } else {
            this.isEnabled = false;
            this.text = `[${l("empty")}]`;
        }
    }
}
