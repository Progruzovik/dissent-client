import Act from "./Act";
import ProjectileService from "./projectile/ProjectileService";
import Ship from "./unit/Ship";
import Unit from "./unit/Unit";
import { getField, postScenario } from "./request";
import * as game from "../game";
import * as PIXI from "pixi.js";

export default class BattleApp extends PIXI.Application {

    private act: Act;

    constructor() {
        super({ width: innerWidth, height: innerHeight, resolution: devicePixelRatio || 1, autoResize: true });
        postScenario(() => {
            getField((ships, guns, size, side, units) => {
                const shipsArray = new Array<Ship>(0);
                for (const shipData of ships) {
                    PIXI.loader.add(shipData.name, "img/" + shipData.name + ".png",
                        (resource: PIXI.loaders.Resource) => {
                        resource.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
                        shipsArray[shipData.id] = new Ship(shipData.speed, resource.texture);
                    });
                }
                PIXI.loader.add("asteroid", "img/asteroid.png", (resource: PIXI.loaders.Resource) =>
                    resource.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST);
                PIXI.loader.load(() => {
                    const projectileService = new ProjectileService();
                    const unitsArray = new Array<Unit>(0);
                    for (const unit of units) {
                        unitsArray.push(new Unit(unit.sideValue, new PIXI.Point(unit.cell.x, unit.cell.y),
                            shipsArray[unit.shipId], guns.filter((gun) => gun.id == unit.firstGunId)[0],
                            guns.filter((gun) => gun.id == unit.secondGunId)[0], projectileService));
                    }
                    this.act = new Act(innerWidth, innerHeight,
                        new PIXI.Point(size.x, size.y), side, unitsArray, projectileService);
                    this.stage.addChild(this.act);

                    this.act.once(game.Event.DONE, () => {
                        this.act.destroy({ children: true });
                        this.act = null;
                    });
                });
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
