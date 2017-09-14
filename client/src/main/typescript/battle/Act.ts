import Controls from "./Controls";
import Queue from "./Queue";
import Field from "./field/Field";
import FieldManager from "./field/FieldManager";
import Gun from "./gun/Gun";
import ProjectileManager from "./gun/ProjectileManager";
import Ship from "./unit/Ship";
import Unit from "./unit/Unit";
import UnitManager from "./unit/UnitManager";
import { Side } from "./utils";
import * as game from "../game";

export default class Act extends game.Act {

    private readonly queue: Queue;
    private readonly controls: Controls;
    private readonly field: Field;

    constructor(width: number, height: number, fieldSize: PIXI.Point, playerSide: Side, unitsData: any) {
        super(width, height);
        const projectileManager = new ProjectileManager();

        const units = new Array<Unit>(0);
        const firstGun = new Gun("Оскол. орудие", 14, 3, ProjectileManager.SHELL, 3, 15);
        const secondGun = new Gun("Лазерн. луч", 10, 2, ProjectileManager.BEAM);
        for (const unitData of unitsData) {
            const ship = new Ship(unitData.ship.speed, PIXI.loader.resources[unitData.ship.name].texture);
            units.push(new Unit(unitData.sideValue, new PIXI.Point(unitData.col, unitData.row),
                ship, firstGun, secondGun, projectileManager));
        }
        const unitManager = new UnitManager(units);
        const asteroids = new Array<PIXI.Point>(0);
        asteroids.push(new PIXI.Point(3, 2), new PIXI.Point(3, 3),
            new PIXI.Point(3, 4), new PIXI.Point(4, 3), new PIXI.Point(4, 4));
        const fieldManager = new FieldManager(fieldSize, unitManager, asteroids);

        this.queue = new Queue(playerSide, unitManager);
        this.field = new Field(projectileManager, fieldManager, asteroids);
        this.content = this.field;
        this.leftUi = this.queue;
        this.controls = new Controls(unitManager);
        this.bottomUi = this.controls;
        this.resize();

        unitManager.on(UnitManager.NEXT_TURN, (currentUnit: Unit) => {
            if (playerSide != currentUnit.side) {
                unitManager.nextTurn();
            }
        });
        unitManager.once(game.Event.DONE, () => this.emit(game.Event.DONE));
    }

    protected resizeUi() {
        this.controls.resize(this.width);
        this.queue.height = this.height - this.controls.height;
    }
}
