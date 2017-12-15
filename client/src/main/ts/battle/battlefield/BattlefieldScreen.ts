import ActionReceiver from "./ActionReceiver"
import Controls from "./Controls";
import Field from "./Field";
import LeftUi from "./LeftUi";
import ProjectileService from "./projectile/ProjectileService";
import Unit from "./unit/Unit";
import UnitService from "./unit/UnitService";
import Window from "./unit/Window";
import WebSocketConnection from "../WebSocketConnection";
import { ActionType, Side } from "../util";
import * as game from "../../game";
import * as PIXI from "pixi.js";

export default class BattlefieldScreen extends game.Screen {

    private currentWindow: Window;

    constructor(fieldSize: game.Point, playerSide: Side, units: Unit[], asteroids: game.Point[],
                clouds: game.Point[], projectileService: ProjectileService, webSocketConnection: WebSocketConnection) {
        super();
        const unitService = new UnitService(playerSide, units, webSocketConnection);

        const field = new Field(fieldSize, units, asteroids, clouds,
            unitService, projectileService, webSocketConnection);
        this.content = field;
        this.leftUi = new LeftUi(playerSide, unitService);
        const controls = new Controls(unitService, webSocketConnection);
        this.bottomUi = controls;
        unitService.emit(ActionType.NextTurn, true);
        const actionReceiver = new ActionReceiver(field, controls, unitService, webSocketConnection);

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
