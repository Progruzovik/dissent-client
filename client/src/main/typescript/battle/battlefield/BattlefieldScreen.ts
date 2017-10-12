import ActionService from "./ActionService"
import Controls from "./Controls";
import Field from "./Field";
import Queue from "./Queue";
import ProjectileService from "./projectile/ProjectileService";
import Unit from "./unit/Unit";
import UnitService from "./unit/UnitService";
import { Cell, Side } from "../request";
import { FINISH, NEXT_TURN } from "../util";
import * as game from "../../game";

export default class BattlefieldScreen extends game.Screen {

    constructor(actionsCount: number, fieldSize: Cell, currentPlayerSide: Side,
                asteroids: Cell[], units: Unit[], projectileService: ProjectileService) {
        super();
        const unitService = new UnitService(currentPlayerSide, units);

        const field = new Field(fieldSize, unitService, projectileService, asteroids);
        this.content = field;
        this.leftUi = new Queue(currentPlayerSide, unitService);
        const controls = new Controls(unitService);
        this.bottomUi = controls;

        const actionService = new ActionService(actionsCount, field, controls, unitService);
        unitService.emit(NEXT_TURN, true);
        actionService.once(FINISH, () => this.emit(game.Event.DONE));
    }
}
