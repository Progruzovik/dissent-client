import Field from "./Field";
import Unit from "./Unit";
import UnitManager from "./UnitManager";
import * as game from "../game";

export default class BattleAct extends game.Actor {

    private static readonly FIELD_LENGTH = 15;
    private static readonly IS_PLAYER_ON_LEFT = true;

    constructor(stageWidth: number, stageHeight: number) {
        super();
        const units: Unit[] = [];
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 3; j++) {
                const isLeft: boolean = i == 0;
                const unit = new Unit(isLeft, isLeft ? 0 : BattleAct.FIELD_LENGTH - 1, (j + 1) * 3);
                units.push(unit);

                unit.on(Unit.SHOT, () => btnFire.setSelectable(false));
            }
        }
        const unitManager = new UnitManager(units);

        const controls = new game.Rectangle(stageWidth, 100, 0x111111);
        const queue = new Queue(stageHeight - controls.height, BattleAct.IS_PLAYER_ON_LEFT, unitManager);
        const field = new Field(BattleAct.FIELD_LENGTH, BattleAct.FIELD_LENGTH,
            stageWidth - queue.width, queue.height, unitManager);
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
            const isCurrentPlayerTurn: boolean = currentUnit.checkLeft() == BattleAct.IS_PLAYER_ON_LEFT;
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

class Queue extends game.Rectangle {

    constructor(height: number, isPlayerOnLeft: boolean, unitManager: UnitManager) {
        super(Unit.WIDTH, height, 0x111111);
        unitManager.getUnits().forEach((unit: Unit, i: number) => {
            const icon = new game.Rectangle(Unit.WIDTH, Unit.HEIGHT,
                unit.checkLeft() == isPlayerOnLeft ? 0x00FF00 : 0xFF0000);
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
