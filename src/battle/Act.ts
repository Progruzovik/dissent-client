import Controls from "./Controls";
import Queue from "./Queue";
import Field from "./field/Field";
import FieldManager from "./field/FieldManager";
import Gun from "./gun/Gun";
import ProjectileManager from "./gun/ProjectileManager";
import Ship from "./unit/Ship";
import Unit from "./unit/Unit";
import UnitManager from "./unit/UnitManager";
import { CellStatus } from "./field/utils";
import * as game from "../game";

export default class Act extends PIXI.Container {

    static readonly IS_PLAYER_ON_LEFT = true;
    private static readonly FIELD_LENGTH = 15;

    private readonly queue: Queue;
    private readonly controls: Controls;
    private readonly field: Field;

    constructor(width: number, height: number) {
        super();
        const projectileManager = new ProjectileManager();

        const ship = new Ship(4, PIXI.loader.resources["ship-3-2"].texture);
        const flagship = new Ship(3, PIXI.loader.resources["ship-5-3"].texture);
        const firstGun = new Gun("Лазерн. луч", 14, 2, ProjectileManager.BEAM);
        const secondGUn = new Gun("Оскол. орудие", 16, 3, ProjectileManager.SHELL, 3, 15);
        const units = new Array<Unit>(0);
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 3; j++) {
                const isLeft: boolean = i == 0;
                const unit = new Unit(isLeft, isLeft ? 0 : Act.FIELD_LENGTH - 1, (j + 1) * 3,
                    j == 2 ? flagship : ship, firstGun, secondGUn, projectileManager);
                units.push(unit);
            }
        }
        const unitManager = new UnitManager(units);

        const map = new Array<CellStatus[]>(Act.FIELD_LENGTH);
        for (let i = 0; i < map.length; i++) {
            map[i] = new Array<CellStatus>(Act.FIELD_LENGTH);
            for (let j = 0; j < map[i].length; j++) {
                map[i][j] = CellStatus.Empty;
            }
        }
        map[3][2] = CellStatus.Asteroid;
        map[3][3] = CellStatus.Asteroid;
        map[3][4] = CellStatus.Asteroid;
        map[4][3] = CellStatus.Asteroid;
        map[4][4] = CellStatus.Asteroid;
        const fieldManager = new FieldManager(Act.FIELD_LENGTH, Act.FIELD_LENGTH, map, unitManager);

        this.queue = new Queue(Act.IS_PLAYER_ON_LEFT, unitManager);
        this.field = new Field(projectileManager, fieldManager);
        this.field.x = this.queue.width;
        this.addChild(this.field);
        this.addChild(this.queue);
        this.controls = new Controls(unitManager);
        this.addChild(this.controls);
        this.resize(width, height);

        unitManager.on(UnitManager.NEXT_TURN, (currentUnit: Unit) => {
            if (currentUnit.isLeft != Act.IS_PLAYER_ON_LEFT) {
                unitManager.nextTurn();
            }
        });
        unitManager.once(game.Event.DONE, () => this.emit(game.Event.DONE));
    }

    resize(width: number, height: number) {
        this.controls.resize(width);
        const bottomControlsIndent: number = height - this.controls.height;
        this.queue.height = bottomControlsIndent;
        this.controls.y = bottomControlsIndent;
        this.field.resize(width - this.queue.width, bottomControlsIndent);
    }
}
