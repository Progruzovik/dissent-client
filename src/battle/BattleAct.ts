import Field from "./Field";
import Unit from "./Unit";
import UnitManager from "./UnitManager";
import * as game from "../game";

export default class BattleAct extends game.Actor {

    private static readonly COLS_COUNT = 15;
    private static readonly IS_PLAYER_LEFT = true;

    constructor(stageWidth: number, stageHeight: number) {
        super();
        const units: Unit[] = [];
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 3; j++) {
                const isLeft: boolean = i == 0;
                const unit = new Unit(isLeft, isLeft ? 0 : BattleAct.COLS_COUNT - 1, (j + 1) * 3);
                units.push(unit);

                unit.on(Unit.SHOT, () => btnFire.setSelectable(false));
            }
        }
        const unitManager = new UnitManager(units);

        const controls = new game.Rectangle(stageWidth, 100, 0x111111);
        const queue = new Queue(stageHeight - controls.height, BattleAct.IS_PLAYER_LEFT, unitManager);
        const field = new Field(BattleAct.COLS_COUNT, 15, stageWidth - queue.width, queue.height, unitManager);
        field.x = queue.width;
        this.addChild(field);
        this.addChild(queue);
        
        const btnFire = new game.Button("Огонь!");
        btnFire.x = game.INDENT;
        btnFire.y = game.INDENT;
        controls.addChild(btnFire);
        const btnFinish = new game.Button("Конец хода");
        btnFinish.x = btnFire.x + btnFire.width + game.INDENT;
        btnFinish.y = btnFire.y;
        controls.addChild(btnFinish);
        controls.y = stageHeight - controls.height;
        this.addChild(controls);

        unitManager.on(UnitManager.NEXT_TURN, (currentUnit: Unit) => {
            const isCurrentPlayerTurn: boolean = currentUnit.checkLeft() == BattleAct.IS_PLAYER_LEFT;
            btnFire.setSelectable(isCurrentPlayerTurn);
            btnFinish.setSelectable(isCurrentPlayerTurn);
            if (!isCurrentPlayerTurn) {
                unitManager.nextTurn();
            }
        });
        unitManager.on(game.Event.FINISH, () => this.emit(game.Event.FINISH));
        btnFire.on(game.Event.BUTTON_CLICK,
            () => unitManager.getCurrentUnit().setPreparedToShot(!unitManager.getCurrentUnit().checkPreparedToShot()));
        btnFinish.on(game.Event.BUTTON_CLICK, () => unitManager.nextTurn());
    }
}

class Queue extends PIXI.Container {

    constructor(private readonly unitManager: UnitManager) {
        super();
        unitManager.on(UnitManager.NEXT_TURN, () => { });
    }
}
