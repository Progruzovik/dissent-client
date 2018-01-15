import Field from "./Field";
import Unit from "./unit/Unit";
import UnitService from "./unit/UnitService";
import WebSocketClient from "../WebSocketClient";
import { ActionType, Gun } from "../util";
import { l } from "../../localizer";
import * as druid from "pixi-druid";

export default class Controls extends druid.AbstractBranch {

    private static readonly SECTIONS_COUNT = 6;
    private static readonly SECTION_RATIO = 3;

    private readonly spriteHull = new PIXI.Sprite();
    private readonly bgHull = new druid.Rectangle(0, 0, 0x333333);

    private readonly barStrength = new druid.ProgressBar(0, 0, 0xff0000, druid.BarTextConfig.Default);
    private readonly bgStats = new PIXI.Container();

    private readonly btnFirstGun = new druid.Button();
    private readonly btnSecondGun = new druid.Button();
    private readonly bgModule = new druid.Rectangle(0, 0);
    private readonly btnNextTurn = new druid.Button(l("endTurn"));

    constructor(private readonly unitService: UnitService, webSocketClient: WebSocketClient) {
        super();
        this.spriteHull.anchor.set(druid.CENTER, druid.CENTER);
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
        this.btnFirstGun.on(druid.Button.TRIGGERED, () =>
            unitService.activeUnit.preparedGunId = unitService.activeUnit.ship.firstGun.id);
        this.btnSecondGun.on(druid.Button.TRIGGERED, () =>
            unitService.activeUnit.preparedGunId = unitService.activeUnit.ship.secondGun.id);
        this.btnNextTurn.on(druid.Button.TRIGGERED, () => webSocketClient.endTurn());
    }

    setUpChildren(width: number, height: number) {
        const widthPerSection = width / Controls.SECTIONS_COUNT;
        const heightPerSection = widthPerSection / Controls.SECTION_RATIO;

        this.bgHull.width = widthPerSection;
        this.bgHull.height = heightPerSection;
        const shipRatio = this.bgHull.height / Field.CELL_SIZE.y;
        this.spriteHull.scale.set(shipRatio, shipRatio);
        this.spriteHull.position.set(this.bgHull.width / 2, this.bgHull.height / 2);

        this.barStrength.txtMain.style = new PIXI.TextStyle({ fill: "white", fontSize: 26, fontWeight: "bold" });
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

        this.btnNextTurn.txtMain.style = new PIXI.TextStyle({ align: "center", fill: "white",
            fontSize: 32, fontWeight: "bold", stroke: "red", strokeThickness: 1.4 });
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
        const activeUnit: Unit = this.unitService.activeUnit;
        this.spriteHull.texture = PIXI.loader.resources[activeUnit.ship.hull.texture.name].texture;
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
