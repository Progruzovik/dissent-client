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
                projectileService: ProjectileService, webSocketConnection: WebSocketConnection) {
        super();
        const unitService = new UnitService(currentPlayerSide, units);

        const field = new Field(fieldSize, asteroids, clouds,
            destroyedUnits, unitService, projectileService, webSocketConnection);
        this.content = field;
        this.leftUi = new Queue(currentPlayerSide, unitService);
        const controls = new Controls(unitService, webSocketConnection);
        this.bottomUi = controls;

        const actionReceiver = new ActionReceiver(field, controls, unitService, webSocketConnection);
        unitService.emit(ActionType.NextTurn, true);
        actionReceiver.once(ActionType.BattleFinish, () => this.emit(game.Event.DONE));
    }
}
