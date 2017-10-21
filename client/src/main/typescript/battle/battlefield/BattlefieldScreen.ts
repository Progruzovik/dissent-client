import ActionReceiver from "./ActionReceiver"
import Controls from "./Controls";
import Field from "./Field";
import Queue from "./Queue";
import ProjectileService from "./projectile/ProjectileService";
import Unit from "./unit/Unit";
import UnitService from "./unit/UnitService";
import WebSocketConnection from "../WebSocketConnection";
import { Side } from "../request";
import { ActionType, Cell } from "../util";
import * as game from "../../game";

export default class BattlefieldScreen extends game.Screen {

    constructor(fieldSize: Cell, currentPlayerSide: Side, asteroids: Cell[],
                clouds: Cell[], destroyedUnits: PIXI.Sprite[], units: Unit[],
                webSocketConnection: WebSocketConnection, projectileService: ProjectileService) {
        super();
        const unitService = new UnitService(currentPlayerSide, units);

        const field = new Field(fieldSize, asteroids, clouds, destroyedUnits, unitService, projectileService);
        this.content = field;
        this.leftUi = new Queue(currentPlayerSide, unitService);
        const controls = new Controls(webSocketConnection, unitService);
        this.bottomUi = controls;

        const actionReceiver = new ActionReceiver(webSocketConnection, field, controls, unitService);
        unitService.emit(ActionType.NextTurn, true);
        actionReceiver.once(ActionType.BattleFinish, () => this.emit(game.Event.DONE));
    }
}
