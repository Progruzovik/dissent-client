import Field from "./Field";
import Unit from "./Unit";
import * as game from "../Game";

export default class BattleAct extends game.Actor {

    private canBeFinished = false;
    private currentUnit: Unit;

    private readonly field: Field;
    private readonly btnFire = new game.Button("Огонь!");
    private readonly btnUp = new game.Button("Вверх");
    private readonly btnDown = new game.Button("Вниз");
    private readonly btnIdle = new game.Button("Вперёд");

    constructor(stageWidth: number, stageHeight: number) {
        super();

        const controls = new game.Rectangle(stageWidth, 100, 0x111111);
        this.field = new Field(20, 20, stageWidth, stageHeight - controls.height);
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 3; j++) {
                const isLeft: boolean = i == 0;
                const unit = new Unit(isLeft, isLeft ? 0 : this.field.getLastCol(), (j + 1) * 3);
                this.field.addUnit(unit);

                unit.on(game.Event.CLICK, () => {
                    if (this.currentUnit.checkPreparedToFire()) {
                        if (this.currentUnit.isLeft != unit.isLeft) {
                            this.currentUnit.fire(unit);
                            this.field.unmarkTargets();
                            this.lockInterface(true);
                        }
                    }
                });
                unit.on(game.Event.TASK_DONE, () => {
                    if (this.currentUnit = unit) {
                        if (unit.getNextCol() >= 0 && unit.getNextCol() <= this.field.getLastCol()) {
                            unit.move();
                        } else {
                            this.canBeFinished = true;
                            this.field.removeChild(this.currentUnit);
                            this.currentUnit = null;
                            this.nextTurn();
                        }
                    }
                });
                unit.on(game.Event.FINISH, () => this.nextTurn());
                unit.on(game.Event.DESTROY, () => {
                    this.canBeFinished = true;
                    this.field.removeUnit(unit);
                });
            }
        }
        this.addChild(this.field);

        this.btnFire.x = game.INDENT;
        this.btnFire.y = game.INDENT;
        controls.addChild(this.btnFire);
        this.btnUp.x = this.btnFire.x + this.btnFire.width + game.INDENT;
        this.btnUp.y = this.btnFire.y;
        controls.addChild(this.btnUp);
        this.btnDown.x = this.btnUp.x + this.btnUp.width + game.INDENT;
        this.btnDown.y = this.btnUp.y;
        controls.addChild(this.btnDown);
        this.btnIdle.x = this.btnDown.x + this.btnDown.width + game.INDENT;
        this.btnIdle.y = this.btnDown.y;
        controls.addChild(this.btnIdle);
        controls.y = stageHeight - controls.height;
        this.addChild(controls);

        this.nextTurn();

        this.btnFire.on(game.Event.BUTTON_CLICK, () => {
            this.currentUnit.setPreparedToFire(!this.currentUnit.checkPreparedToFire());
            if (this.currentUnit.checkPreparedToFire()) {
                this.field.markTargets(!this.currentUnit.isLeft);
                this.lockInterface(false);
            } else {
                this.field.unmarkTargets();
                this.updateInterface();
            }
        });
        this.btnUp.on(game.Event.BUTTON_CLICK, () => this.currentUnit.changeRow(true));
        this.btnDown.on(game.Event.BUTTON_CLICK, () => this.currentUnit.changeRow(false));
        this.btnIdle.on(game.Event.BUTTON_CLICK, () => this.currentUnit.idle());
    }

    private canCurrentUnitUp(): boolean {
        return this.currentUnit.getRow() != 0
            && !this.field.hasUnitOnCell(this.currentUnit.getNextCol(), this.currentUnit.getRow() - 1);
    }

    private canCurrentUnitDown(): boolean {
        return this.currentUnit.getRow() != this.field.getLastRow()
            && !this.field.hasUnitOnCell(this.currentUnit.getNextCol(), this.currentUnit.getRow() + 1);
    }

    private canCurrentUnitForward(): boolean {
        return !this.field.hasUnitOnCell(this.currentUnit.getNextCol(), this.currentUnit.getRow());
    }

    private nextTurn() {
        if (this.canBeFinished) {
            if (!this.field.hasUnitsOnBothSides()) {
                this.emit(game.Event.FINISH);
                return;
            }
            this.canBeFinished = false;
        }
        this.currentUnit = this.field.nextTurn(this.currentUnit);
        if (this.currentUnit.isLeft) {
            this.updateInterface();
        } else {
            if (this.canCurrentUnitForward()) {
                this.currentUnit.idle();
            } else {
                this.currentUnit.changeRow(this.canCurrentUnitUp());
            }
        }
    }

    private updateInterface() {
        const canCurrentUnitForward: boolean = this.canCurrentUnitForward();
        this.btnFire.setSelectable(canCurrentUnitForward);
        this.btnUp.setSelectable(this.canCurrentUnitUp());
        this.btnDown.setSelectable(this.canCurrentUnitDown());
        this.btnIdle.setSelectable(canCurrentUnitForward);
    }

    private lockInterface(withBtnFire: boolean) {
        if (withBtnFire) {
            this.btnFire.setSelectable(false);
        }
        this.btnUp.setSelectable(false);
        this.btnDown.setSelectable(false);
        this.btnIdle.setSelectable(false);
    }
}
