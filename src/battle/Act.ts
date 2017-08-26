import Queue from "./Queue";
import Field from "./field/Field";
import FieldManager from "./field/FieldManager";
import GunManager from "./gun/GunManager";
import GunSpecification from "./gun/GunSpecification";
import Ship from "./unit/Ship";
import Unit from "./unit/Unit";
import UnitManager from "./unit/UnitManager";
import * as game from "../game";

export default class Act extends PIXI.Container {

    private static readonly FIELD_LENGTH = 45;
    private static readonly IS_PLAYER_ON_LEFT = true;

    private static readonly GUN_BEAM = 1;
    private static readonly GUN_SHELL = 2;

    private readonly queue: Queue;
    private readonly controls = new game.Rectangle(0, 100);
    private readonly field: Field;

    constructor(width: number, height: number) {
        super();
        const guns = new Array<GunSpecification>(1);
        guns.push(new GunSpecification(15, GunManager.BEAM));
        guns.push(new GunSpecification(15, GunManager.SHELL, 3, 15));
        const gunManager = new GunManager(guns);
        const ship = new Ship(3);
        const units = new Array<Unit>(0);
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 3; j++) {
                const isLeft: boolean = i == 0;
                const unit = new Unit(isLeft, isLeft ? 0 : Act.FIELD_LENGTH - 1, (j + 1) * 3,
                    ship, Act.GUN_BEAM, Act.GUN_SHELL, gunManager);
                units.push(unit);

                unit.on(Unit.SHOT, () => {
                    if (unit.preparedGun == unit.firstGun) {
                        btnFirstGun.isEnabled = false;
                    } else if (unit.preparedGun == unit.secondGun) {
                        btnSecondGun.isEnabled = false;
                    }
                });
            }
        }
        const unitManager = new UnitManager(units);
        const fieldManager = new FieldManager(Act.FIELD_LENGTH, Act.FIELD_LENGTH, unitManager);

        this.queue = new Queue(Act.IS_PLAYER_ON_LEFT, unitManager);
        this.field = new Field(gunManager, fieldManager);
        this.field.x = this.queue.width;
        this.addChild(this.field);
        this.addChild(this.queue);
        const btnFirstGun = new game.Button("Лазерн. луч");
        btnFirstGun.x = game.INDENT;
        btnFirstGun.y = game.INDENT;
        this.controls.addChild(btnFirstGun);
        const btnSecondGun = new game.Button("Бластер");
        btnSecondGun.x = btnFirstGun.x + btnFirstGun.width + game.INDENT;
        btnSecondGun.y = btnFirstGun.y;
        this.controls.addChild(btnSecondGun);
        const btnFinish = new game.Button("Конец хода");
        btnFinish.x = btnSecondGun.x + btnSecondGun.width + game.INDENT;
        btnFinish.y = btnSecondGun.y;
        this.controls.addChild(btnFinish);
        this.addChild(this.controls);
        this.resize(width, height);

        unitManager.on(UnitManager.NEXT_TURN, (currentUnit: Unit) => {
            const isCurrentPlayerTurn: boolean = currentUnit.isLeft == Act.IS_PLAYER_ON_LEFT;
            btnFirstGun.isEnabled = isCurrentPlayerTurn;
            btnSecondGun.isEnabled = isCurrentPlayerTurn;
            btnFinish.isEnabled = isCurrentPlayerTurn;
            if (!isCurrentPlayerTurn) {
                unitManager.nextTurn();
            }
        });
        btnFirstGun.on(game.Event.BUTTON_CLICK, () => {
            if (unitManager.currentUnit.preparedGun == unitManager.currentUnit.firstGun) {
                unitManager.currentUnit.preparedGun = null;
            } else {
                unitManager.currentUnit.preparedGun = unitManager.currentUnit.firstGun;
            }
        });
        btnSecondGun.on(game.Event.BUTTON_CLICK, () => {
            if (unitManager.currentUnit.preparedGun == unitManager.currentUnit.secondGun) {
                unitManager.currentUnit.preparedGun = null;
            } else {
                unitManager.currentUnit.preparedGun = unitManager.currentUnit.secondGun;
            }
        });
        btnFinish.on(game.Event.BUTTON_CLICK, () => unitManager.nextTurn());
        unitManager.once(game.Event.DONE, () => this.emit(game.Event.DONE));
    }

    resize(width: number, height: number) {
        const bottomControlsIndent: number = height - this.controls.height;
        this.queue.height = bottomControlsIndent;
        this.controls.width = width;
        this.controls.y = bottomControlsIndent;
        this.field.resize(width - this.queue.width, bottomControlsIndent);
    }
}
