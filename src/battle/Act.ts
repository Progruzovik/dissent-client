import Beam from "./gun/Beam";
import Blaster from "./gun/Blaster";
import Ship from "./unit/Ship";
import Field from "./field/Field";
import Unit from "./unit/Unit";
import UnitManager from "./unit/UnitManager";
import FieldManager from "./field/FieldManager";
import * as game from "../game";

export default class Act extends game.Actor {

    private static readonly FIELD_LENGTH = 15;
    private static readonly IS_PLAYER_ON_LEFT = true;

    constructor(stageWidth: number, stageHeight: number) {
        super();
        const ship = new Ship(3);
        const beam = new Beam();
        const blaster = new Blaster();
        const units = new Array<Unit>(0);
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 3; j++) {
                const isLeft: boolean = i == 0;
                const unit = new Unit(isLeft, isLeft ? 0 : Act.FIELD_LENGTH - 1, (j + 1) * 3, ship, beam, blaster);
                units.push(unit);

                unit.on(Unit.SHOT, () => {
                    if (unit.preparedGun == unit.firstGun) {
                        btnFirstGun.setSelectable(false);
                    } else if (unit.preparedGun == unit.secondGun) {
                        btnSecondGun.setSelectable(false);
                    }
                });
            }
        }
        const unitManager = new UnitManager(units);
        const fieldManager = new FieldManager(Act.FIELD_LENGTH, Act.FIELD_LENGTH, unitManager);

        const controls = new game.Rectangle(stageWidth, 100, 0x111111);
        const queue = new Queue(Act.IS_PLAYER_ON_LEFT, stageHeight - controls.height, unitManager);
        const field = new Field(fieldManager, stageWidth - queue.width, queue.height);
        field.x = queue.width;
        this.addChild(field);
        this.addChild(queue);

        const btnFirstGun = new game.Button("Лазерн. луч");
        btnFirstGun.x = game.INDENT;
        btnFirstGun.y = game.INDENT;
        controls.addChild(btnFirstGun);
        const btnSecondGun = new game.Button("Бластер");
        btnSecondGun.x = btnFirstGun.x + btnFirstGun.width + game.INDENT;
        btnSecondGun.y = btnFirstGun.y;
        controls.addChild(btnSecondGun);
        const btnFinish = new game.Button("Конец хода");
        btnFinish.x = btnSecondGun.x + btnSecondGun.width + game.INDENT;
        btnFinish.y = btnSecondGun.y;
        controls.addChild(btnFinish);
        controls.y = stageHeight - controls.height;
        this.addChild(controls);

        unitManager.on(UnitManager.NEXT_TURN, (currentUnit: Unit) => {
            const isCurrentPlayerTurn: boolean = currentUnit.isLeft == Act.IS_PLAYER_ON_LEFT;
            btnFirstGun.setSelectable(isCurrentPlayerTurn);
            btnSecondGun.setSelectable(isCurrentPlayerTurn);
            btnFinish.setSelectable(isCurrentPlayerTurn);
            if (!isCurrentPlayerTurn) {
                unitManager.nextTurn();
            }
        });
        unitManager.on(game.Event.DONE, () => this.emit(game.Event.DONE));
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
    }
}

class Queue extends game.Rectangle {

    constructor(isPlayerOnLeft: boolean, height: number, unitManager: UnitManager) {
        super(Unit.WIDTH, height, 0x111111);
        unitManager.units.forEach((unit: Unit, i: number) => {
            const icon = new game.Rectangle(Unit.WIDTH, Unit.HEIGHT,
                unit.isLeft == isPlayerOnLeft ? 0x00FF00 : 0xFF0000);
            icon.addChild(new PIXI.Sprite(PIXI.loader.resources["Ship-3-2"].texture));
            icon.y = Unit.HEIGHT * i;
            this.addChild(icon);

            unit.on(Unit.DESTROY, () => {
                this.removeChild(icon);
                this.updateChildrenPositions();
            });
        });

        unitManager.on(UnitManager.NEXT_TURN, () => {
            this.setChildIndex(this.getChildAt(0), this.children.length - 1);
            this.updateChildrenPositions();
        });
    }

    private updateChildrenPositions() {
        this.children.forEach((child: PIXI.DisplayObject, i: number) => child.y = Unit.HEIGHT * i);
    }
}
