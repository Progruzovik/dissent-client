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

export default class Act extends game.Act {

    private readonly queue: Queue;
    private readonly controls: Controls;
    private readonly field: Field;

    constructor(width: number, height: number, actionsCount: number, fieldSize: Cell,
                currentPlayerSide: Side, asteroids: Cell[], units: Unit[], projectileService: ProjectileService) {
        super(width, height);
        const unitService = new UnitService(currentPlayerSide, units);
        this.queue = new Queue(currentPlayerSide, unitService);
        this.field = new Field(fieldSize, unitService, projectileService, asteroids);
        this.controls = new Controls(unitService);
        const actionService = new ActionService(actionsCount, this.field, this.controls, unitService);

        this.content = this.field;
        this.leftUi = this.queue;
        this.bottomUi = this.controls;
        this.resize();

        unitService.emit(NEXT_TURN, true);
        actionService.on(FINISH, () => this.emit(game.Event.DONE));
    }

    protected resizeUi() {
        this.controls.resize(this.width);
        this.queue.height = this.height - this.controls.height;
    }
}
