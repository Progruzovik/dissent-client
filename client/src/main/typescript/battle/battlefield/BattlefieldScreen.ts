import ActionService from "./ActionReceiver"
import Controls from "./Controls";
import Field from "./Field";
import Queue from "./Queue";
import ProjectileService from "./projectile/ProjectileService";
import Unit from "./unit/Unit";
import UnitService from "./unit/UnitService";
import { Cell, Side } from "../request";
import { ActionType } from "../util";
import * as game from "../../game";
import WebSocketConnection from "../WebSocketConnection";

export default class BattlefieldScreen extends game.Screen {

    constructor(actionsCount: number, fieldSize: Cell, currentPlayerSide: Side, asteroids: Cell[], clouds: Cell[],
                units: Unit[], webSocketConnection: WebSocketConnection, projectileService: ProjectileService) {
        super();
        const unitService = new UnitService(currentPlayerSide, units);

        const field = new Field(fieldSize, asteroids, clouds, unitService, projectileService);
        this.content = field;
        this.leftUi = new Queue(currentPlayerSide, unitService);
        const controls = new Controls(unitService);
        this.bottomUi = controls;

        const actionService = new ActionService(actionsCount, webSocketConnection, field, controls, unitService);
        unitService.emit(ActionType[ActionType.NextTurn], true);
        actionService.once(ActionType[ActionType.Finish], () => this.emit(game.Event.DONE));
    }
}
