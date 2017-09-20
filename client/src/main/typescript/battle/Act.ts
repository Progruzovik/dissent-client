import Controls from "./Controls";
import Queue from "./Queue";
import Field from "./Field";
import ProjectileService from "./projectile/ProjectileService";
import Unit from "./unit/Unit";
import UnitService from "./unit/UnitService";
import { Cell, Side } from "./request";
import * as game from "../game";

export default class Act extends game.Act {

    private readonly queue: Queue;
    private readonly controls: Controls;
    private readonly field: Field;

    constructor(width: number, height: number, fieldSize: PIXI.Point, playerSide: Side,
                asteroids: Cell[], units: Unit[], projectileService: ProjectileService) {
        super(width, height);
        const unitService = new UnitService(units);

        this.queue = new Queue(playerSide, unitService);
        this.field = new Field(fieldSize, projectileService, unitService, asteroids);
        this.content = this.field;
        this.leftUi = this.queue;
        this.controls = new Controls(unitService);
        this.bottomUi = this.controls;
        this.resize();
        unitService.emit(UnitService.NEXT_TURN, unitService.currentUnit, true);

        unitService.on(UnitService.NEXT_TURN, (currentUnit: Unit) => {
            if (playerSide != currentUnit.side) {
                this.controls.lockInterface();
                unitService.nextTurn();
            }
        });
        unitService.once(game.Event.DONE, () => this.emit(game.Event.DONE));
    }

    protected resizeUi() {
        this.controls.resize(this.width);
        this.queue.height = this.height - this.controls.height;
    }
}
