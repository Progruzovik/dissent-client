import BattleAct from "./BattleAct";
import * as game from "../game";
import * as PIXI from "pixi.js";

export default class BattleApp extends PIXI.Application {

    private static readonly WIDTH = 1024;
    private static readonly HEIGHT = 768;

    constructor() {
        super(BattleApp.WIDTH, BattleApp.HEIGHT, { resolution: window.devicePixelRatio || 1, autoResize: true });
        PIXI.loader.add("Ship-3-2", "/img/Ship-3-2.png",
            (resource: PIXI.loaders.Resource) => resource.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST);
        PIXI.loader.load(() => {
            const act = new BattleAct(BattleApp.WIDTH, BattleApp.HEIGHT);
            this.stage.addChild(act);
            this.ticker.add(() => act.emit(game.Event.UPDATE));

            act.on(game.Event.FINISH, () => this.stage.removeChild(act));
        });
    }
}
