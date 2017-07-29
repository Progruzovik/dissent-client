import BattleAct from "./battle/BattleAct";
import * as game from "./Game";
import * as PIXI from "pixi.js";

export default class Space extends PIXI.Application {

    private static readonly WIDTH = 1024;
    private static readonly HEIGHT = 768;

    private readonly currentAct = new BattleAct(Space.WIDTH, Space.HEIGHT);

    constructor() {
        super(Space.WIDTH, Space.HEIGHT, { resolution: window.devicePixelRatio || 1, autoResize: true });
        this.stage.addChild(this.currentAct);
        this.ticker.add(() => this.currentAct.emit(game.Event.UPDATE));

        this.currentAct.on(game.Event.FINISH, () => this.stage.removeChild(this.currentAct));
    }
}
