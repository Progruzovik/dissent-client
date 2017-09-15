import Act from "./Act";
import Ship from "./unit/Ship";
import axios from "axios";
import * as game from "../game";
import * as PIXI from "pixi.js";

export default class BattleApp extends PIXI.Application {

    private act: Act;

    constructor() {
        super({ width: innerWidth, height: innerHeight, resolution: devicePixelRatio || 1, autoResize: true });
        axios.all([
            axios.get("/api/field/ships"),
            axios.get("/api/field/size"),
            axios.get("/api/field/side"),
            axios.get("/api/field/queue")
        ]).then(axios.spread((ships, size, side, queue) => {
            const shipsArray = new Array<Ship>(0);
            for (const shipData of ships.data) {
                PIXI.loader.add(shipData.name, "img/" + shipData.name + ".png", (resource: PIXI.loaders.Resource) => {
                    resource.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
                    shipsArray[shipData.id] = new Ship(shipData.speed, resource.texture);
                });
            }
            PIXI.loader.add("asteroid", "img/asteroid.png", (resource: PIXI.loaders.Resource) =>
                resource.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST);
            PIXI.loader.load(() => {
                this.act = new Act(innerWidth, innerHeight, shipsArray,
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
