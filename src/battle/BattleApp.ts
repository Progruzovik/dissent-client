import Act from "./Act";
import * as game from "../game";
import * as PIXI from "pixi.js";

export default class BattleApp extends PIXI.Application {

    private act: Act;

    constructor() {
        super(innerWidth, innerHeight, { resolution: devicePixelRatio || 1, autoResize: true });
        PIXI.loader.add("ship-3-2", "img/Ship-3-2.png",
            (resource: PIXI.loaders.Resource) => resource.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST);
        PIXI.loader.add("ship-5-3", "img/Ship-5-3.png",
            (resource: PIXI.loaders.Resource) => resource.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST);
        PIXI.loader.load(() => {
            this.act = new Act(innerWidth, innerHeight);
            this.stage.addChild(this.act);

            this.act.once(game.Event.DONE, () => {
                this.act.destroy({ children: true });
                this.act = null;
            });
        });

        onresize = () => {
            this.renderer.resize(innerWidth, innerHeight);
            if (this.act) {
                this.act.resize(innerWidth, innerHeight);
            }
        }
    }
}
