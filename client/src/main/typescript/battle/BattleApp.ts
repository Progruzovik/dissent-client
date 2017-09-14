import Act from "./Act";
import * as game from "../game";
import * as PIXI from "pixi.js";
import axios from "axios";

export default class BattleApp extends PIXI.Application {

    private act: Act;

    constructor() {
        super(innerWidth, innerHeight, { resolution: devicePixelRatio || 1, autoResize: true });
        axios.all([
            axios.get("api/field/size"),
            axios.get("api/field/side"),
            axios.get("api/field/queue")
        ]).then(axios.spread((size, side, queue) => {
            PIXI.loader.add("asteroid", "img/asteroid.png", (resource: PIXI.loaders.Resource) =>
                resource.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST);
            PIXI.loader.add("ship-2-2", "img/ship-2-2.png", (resource: PIXI.loaders.Resource) =>
                resource.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST);
            PIXI.loader.add("ship-3-1", "img/ship-3-1.png", (resource: PIXI.loaders.Resource) =>
                resource.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST);
            PIXI.loader.add("ship-4-2", "img/ship-4-2.png", (resource: PIXI.loaders.Resource) =>
                resource.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST);
            PIXI.loader.load(() => {
                this.act = new Act(innerWidth, innerHeight,
                    new PIXI.Point(size.data.x, size.data.y), side.data, queue.data);
                this.stage.addChild(this.act);

                this.act.once(game.Event.DONE, () => {
                    this.act.destroy({ children: true });
                    this.act = null;
                });
            });
        }));

        onresize = () => {
            this.renderer.resize(innerWidth, innerHeight);
            if (this.act) {
                this.act.resize(innerWidth, innerHeight);
            }
        }
    }
}
