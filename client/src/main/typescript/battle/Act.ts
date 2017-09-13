import Controls from "./Controls";
import Queue from "./Queue";
import Field from "./field/Field";
import FieldManager from "./field/FieldManager";
import Gun from "./gun/Gun";
import ProjectileManager from "./gun/ProjectileManager";
import Ship from "./unit/Ship";
import Unit from "./unit/Unit";
import UnitManager from "./unit/UnitManager";
import * as game from "../game";

export default class Act extends game.Act {

    static readonly IS_PLAYER_ON_LEFT = true;

    private readonly queue: Queue;
    private readonly controls: Controls;
    private readonly field: Field;

    constructor(width: number, height: number, fieldSize: PIXI.Point, unitData: any) {
        super(width, height);
        const projectileManager = new ProjectileManager();

        const units = new Array<Unit>(0);
        const firstGun = new Gun("Оскол. орудие", 14, 3, ProjectileManager.SHELL, 3, 15);
        const secondGun = new Gun("Лазерн. луч", 10, 2, ProjectileManager.BEAM);
        for (const el of unitData) {
            const ship = new Ship(el.ship.speed, PIXI.loader.resources[el.ship.name].texture);
            units.push(new Unit(el.side == "Left", new PIXI.Point(el.col, el.row),
                ship, firstGun, secondGun, projectileManager));
        }
        const unitManager = new UnitManager(units);
        const asteroids = new Array<PIXI.Point>(0);
        asteroids.push(new PIXI.Point(3, 2), new PIXI.Point(3, 3),
            new PIXI.Point(3, 4), new PIXI.Point(4, 3), new PIXI.Point(4, 4));
        const fieldManager = new FieldManager(fieldSize, unitManager, asteroids);

        this.queue = new Queue(Act.IS_PLAYER_ON_LEFT, unitManager);
        this.field = new Field(projectileManager, fieldManager, asteroids);
        this.content = this.field;
        this.leftUi = this.queue;
        this.controls = new Controls(unitManager);
        this.bottomUi = this.controls;
        this.resize();

        unitManager.on(UnitManager.NEXT_TURN, (currentUnit: Unit) => {
            if (currentUnit.isLeft != Act.IS_PLAYER_ON_LEFT) {
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
