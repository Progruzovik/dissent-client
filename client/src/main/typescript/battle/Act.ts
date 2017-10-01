import ActionService from "./ActionService"
import Controls from "./Controls";
import Field from "./Field";
import Queue from "./Queue";
import ProjectileService from "./projectile/ProjectileService";
import Unit from "./unit/Unit";
import UnitService from "./unit/UnitService";
import { Action, Cell, getMove, getShot, Side } from "./request";
import { MOVE, NEXT_TURN, SHOT } from "./util";
import * as game from "../game";

export default class Act extends game.Act {

    private readonly queue: Queue;
    private readonly controls: Controls;
    private readonly field: Field;

    constructor(width: number, height: number, actionsCount: number, fieldSize: Cell,
                currentPlayerSide: Side, asteroids: Cell[], units: Unit[], projectileService: ProjectileService) {
        super(width, height);
        const actionService = new ActionService(actionsCount);
        const unitService = new UnitService(units);

        this.queue = new Queue(currentPlayerSide, unitService);
        this.field = new Field(fieldSize, unitService, projectileService, asteroids);
        this.content = this.field;
        this.leftUi = this.queue;
        this.controls = new Controls(currentPlayerSide, unitService);
        this.bottomUi = this.controls;
        this.resize();
        unitService.emit(NEXT_TURN, true);

        actionService.on(MOVE, (action: Action) => {
            this.field.removeMarksAndPath(true);
            this.controls.lockInterface();
            getMove(action.number, move => {
                unitService.currentUnit.path = move;
                actionService.run();
            });
        });
        actionService.on(SHOT, (action: Action) => {
            this.field.removeMarksAndPath(true);
            this.controls.lockInterface();
            getShot(action.number, shot => {
                unitService.currentUnit.shoot(unitService.units.filter(unit =>
                    unit.cell.x == shot.cell.x && unit.cell.y == shot.cell.y)[0], shot.gunId);
                actionService.run();
            });
        });
        actionService.on(NEXT_TURN, () => {
            unitService.nextTurn();
            actionService.run();
        });
        unitService.once(game.Event.DONE, () => this.emit(game.Event.DONE));
    }

    protected resizeUi() {
        this.controls.resize(this.width);
        this.queue.height = this.height - this.controls.height;
    }
}
