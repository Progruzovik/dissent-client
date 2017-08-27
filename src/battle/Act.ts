import Controls from "./Controls";
import Queue from "./Queue";
import Field from "./field/Field";
import FieldManager from "./field/FieldManager";
import Gun from "./gun/Gun";
import GunManager from "./gun/GunManager";
import Ship from "./unit/Ship";
import Unit from "./unit/Unit";
import UnitManager from "./unit/UnitManager";
import * as game from "../game";

export default class Act extends PIXI.Container {

    static readonly IS_PLAYER_ON_LEFT = true;
    private static readonly FIELD_LENGTH = 15;

    private readonly queue: Queue;
    private readonly controls: Controls;
    private readonly field: Field;

    constructor(width: number, height: number) {
        super();
        const gunManager = new GunManager();
        const ship = new Ship(3);
        const firstGun = new Gun("Лазерн. луч", 15, GunManager.BEAM);
        const secondGUn = new Gun("Оскол. орудие", 15, GunManager.SHELL, 3, 15);
        const units = new Array<Unit>(0);
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 3; j++) {
                const isLeft: boolean = i == 0;
                const unit = new Unit(isLeft, isLeft ? 0 : Act.FIELD_LENGTH - 1, (j + 1) * 3,
                    ship, firstGun, secondGUn, gunManager);
                units.push(unit);
            }
        }
        const unitManager = new UnitManager(units);
        const fieldManager = new FieldManager(Act.FIELD_LENGTH, Act.FIELD_LENGTH, unitManager);

        this.queue = new Queue(Act.IS_PLAYER_ON_LEFT, unitManager);
        this.field = new Field(gunManager, fieldManager);
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
