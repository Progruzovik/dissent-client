import ActionReceiver from "./ActionReceiver"
import Controls from "./Controls";
import Field from "./Field";
import LeftUi from "./LeftUi";
import ProjectileService from "./projectile/ProjectileService";
import Unit from "./unit/Unit";
import UnitService from "./unit/UnitService";
import WebSocketConnection from "../WebSocketConnection";
import { ActionType, Cell, Side } from "../util";
import * as game from "../../game";
import * as PIXI from "pixi.js";

export default class BattlefieldScreen extends game.Screen {

    constructor(fieldSize: Cell, currentPlayerSide: Side, asteroids: Cell[],
                clouds: Cell[], destroyedUnits: PIXI.Sprite[], units: Unit[],
                projectileService: ProjectileService, webSocketConnection: WebSocketConnection) {
        super();
        const unitService = new UnitService(currentPlayerSide, units, webSocketConnection);

        const field = new Field(fieldSize, asteroids, clouds,
            destroyedUnits, unitService, projectileService, webSocketConnection);
        this.content = field;
        this.leftUi = new LeftUi(currentPlayerSide, unitService);
        const controls = new Controls(unitService, webSocketConnection);
        this.bottomUi = controls;
        this.frontUi = new game.UiElement();
        unitService.emit(ActionType.NextTurn, true);
        const actionReceiver = new ActionReceiver(field, controls, unitService, webSocketConnection);

        unitService.on(UnitService.UNIT_MOUSE_OVER, (unit: Unit) => {
            const window = new game.Rectangle(200, 0, 0x333333);
            window.pivot.x = window.width;
            window.x = this.width;
            const txtUnit = new PIXI.Text(unit.hull.texture.name, { fill: 0xffffff });
            txtUnit.anchor.x = game.CENTER;
            txtUnit.x = window.width / 2;
            window.addChild(txtUnit);
            const barHealth = new game.ProgressBar(window.width, 15, 0xff0000, unit.hull.strength);
            barHealth.value = unit.strength;
            barHealth.y = txtUnit.height;
            window.addChild(barHealth);
            window.height = barHealth.y + barHealth.height + game.INDENT;
            this.frontUi.addChild(window);
        });
        unitService.on(UnitService.UNIT_MOUSE_OUT, () => this.frontUi.removeChildren());
        actionReceiver.once(ActionType.BattleFinish, () => this.emit(game.Event.DONE));
    }
}
