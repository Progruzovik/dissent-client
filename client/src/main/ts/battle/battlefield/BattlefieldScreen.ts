import ActionReceiver from "./ActionReceiver"
import Controls from "./Controls";
import Field from "./Field";
import LeftUi from "./LeftUi";
import ProjectileService from "./projectile/ProjectileService";
import Unit from "./unit/Unit";
import UnitService from "./unit/UnitService";
import Window from "./unit/Window";
import WebSocketClient from "../WebSocketClient";
import { ActionType, Side } from "../util";
import * as game from "../../game";
import * as PIXI from "pixi.js";

export default class BattlefieldScreen extends game.Screen {

    private currentWindow: Window;

    constructor(fieldSize: game.Point, playerSide: Side, units: Unit[], asteroids: game.Point[],
                clouds: game.Point[], projectileService: ProjectileService, webSocketClient: WebSocketClient) {
        super();
        const unitService = new UnitService(playerSide, units, webSocketClient);

        const field = new Field(fieldSize, units, asteroids, clouds, unitService, projectileService, webSocketClient);
        this.content = field;
        this.leftUi = new LeftUi(units, unitService);
        const controls = new Controls(unitService, webSocketClient);
        this.bottomUi = controls;
        unitService.emit(ActionType.NextTurn, true);
        const actionReceiver = new ActionReceiver(field, controls, unitService, webSocketClient);

        unitService.on(UnitService.UNIT_MOUSE_OVER, (mousePos: PIXI.Point, unit: Unit) => {
            if (this.currentWindow) {
                this.currentWindow.destroy({ children: true });
            }
            this.currentWindow = new Window(playerSide, unit);
            this.frontUi = this.currentWindow;
        });
        unitService.on(UnitService.UNIT_MOUSE_OUT, (unit: Unit) => {
            if (this.currentWindow.unit == unit) {
                this.currentWindow.destroy({ children: true });
                this.currentWindow = null;
                this.frontUi = null;
            }
        });
        actionReceiver.once(ActionType.BattleFinish, () => this.emit(game.Event.DONE));
    }
}
