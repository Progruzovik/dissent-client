import Controls from "./Controls";
import Queue from "./Queue";
import Field from "./field/Field";
import FieldService from "./field/FieldService";
import ProjectileService from "./gun/ProjectileService";
import Unit from "./unit/Unit";
import UnitService from "./unit/UnitService";
import { Side } from "./utils";
import * as game from "../game";

export default class Act extends game.Act {

    private readonly queue: Queue;
    private readonly controls: Controls;
    private readonly field: Field;

    constructor(width: number, height: number, fieldSize: PIXI.Point,
                playerSide: Side, units: Unit[], projectileService: ProjectileService) {
        super(width, height);

        const unitService = new UnitService(units);
        const asteroids = new Array<PIXI.Point>(0);
        asteroids.push(new PIXI.Point(3, 2), new PIXI.Point(3, 3),
            new PIXI.Point(3, 4), new PIXI.Point(4, 3), new PIXI.Point(4, 4));
        const fieldService = new FieldService(fieldSize, unitService, asteroids);

        this.queue = new Queue(playerSide, unitService);
        this.field = new Field(projectileService, fieldService, asteroids);
        this.content = this.field;
        this.leftUi = this.queue;
        this.controls = new Controls(unitService);
        this.bottomUi = this.controls;
        this.resize();

        unitService.on(UnitService.NEXT_TURN, (currentUnit: Unit) => {
            this.controls.setInterfaceStatus(playerSide == currentUnit.side);
            if (playerSide != currentUnit.side) {
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
