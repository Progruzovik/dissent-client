import Field from "./Field";
import Unit from "./Unit";
import UnitManager from "./UnitManager";
import * as game from "../game";

export default class BattleAct extends game.Actor {

    private readonly unitManager: UnitManager;

    private readonly field: Field;
    private readonly btnFire = new game.Button("Огонь!");
    private readonly btnFinish = new game.Button("Конец хода");

    constructor(stageWidth: number, stageHeight: number) {
        super();
        const COLS_COUNT = 15;
        const units: Unit[] = [];
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 3; j++) {
                const isLeft: boolean = i == 0;
                const unit = new Unit(isLeft, isLeft ? 0 : COLS_COUNT - 1, (j + 1) * 3);
                units.push(unit);
                
                unit.on(Unit.SHOT, () => this.btnFire.setSelectable(false));
            }
        }
        this.unitManager = new UnitManager(units);

        const controls = new game.Rectangle(stageWidth, 100, 0x111111);
        this.field = new Field(this.unitManager, COLS_COUNT, 15, stageWidth, stageHeight - controls.height);
        this.addChild(this.field);
        this.btnFire.x = game.INDENT;
        this.btnFire.y = game.INDENT;
        controls.addChild(this.btnFire);
        this.btnFinish.x = this.btnFire.x + this.btnFire.width + game.INDENT;
        this.btnFinish.y = this.btnFire.y;
        controls.addChild(this.btnFinish);
        controls.y = stageHeight - controls.height;
        this.addChild(controls);

        this.nextTurn();

        this.unitManager.on(game.Event.FINISH, () => this.emit(game.Event.FINISH));
        this.btnFire.on(game.Event.BUTTON_CLICK, () => this.unitManager.getCurrentUnit().setPreparedToShot(
            !this.unitManager.getCurrentUnit().checkPreparedToShot()));
        this.btnFinish.on(game.Event.BUTTON_CLICK, () => this.nextTurn());
    }

    private nextTurn() {
        const currentUnit: Unit = this.unitManager.nextTurn();
        const isCurrentPlayerTurn: boolean = currentUnit.checkLeft();
        this.btnFire.setSelectable(isCurrentPlayerTurn);
        this.btnFinish.setSelectable(isCurrentPlayerTurn);
        if (!isCurrentPlayerTurn) {
            currentUnit.moveTo(currentUnit.getCol() - 1, currentUnit.getRow());
            this.nextTurn();
        }
    }
}
