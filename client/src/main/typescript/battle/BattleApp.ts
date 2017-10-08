import BattlefieldScreen from "./battlefield/BattlefieldScreen";
import ProjectileService from "./battlefield/projectile/ProjectileService";
import Unit from "./battlefield/unit/Unit";
import MenuScreen from "./menu/MenuScreen";
import { getField } from "./request";
import * as game from "../game";
import * as PIXI from "pixi.js";

export default class BattleApp extends game.Application {

    private readonly menuScreen = new MenuScreen();

    constructor() {
        super();
        this.currentScreen = this.menuScreen;
        this.menuScreen.on(game.Event.DONE, () => {
            getField((actionsCount, hulls, guns, size, side, asteroids, units) => {
                PIXI.loader.reset();
                for (const shipData of hulls) {
                    PIXI.loader.add(shipData.name, "img/" + shipData.name + ".png",
                        (resource: PIXI.loaders.Resource) =>
                            resource.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST);
                }
                PIXI.loader.add("asteroid", "img/asteroid.png", (resource: PIXI.loaders.Resource) =>
                    resource.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST);
                PIXI.loader.load(() => {
                    const projectileService = new ProjectileService();
                    const unitsArray = new Array<Unit>(0);
                    for (const unit of units) {
                        unitsArray.push(new Unit(unit.side, unit.cell,
                            hulls.filter(hull => hull.id == unit.hullId)[0],
                            guns.filter(gun => gun.id == unit.firstGunId)[0],
                            guns.filter(gun => gun.id == unit.secondGunId)[0], projectileService));
                    }
                    this.currentScreen = new BattlefieldScreen(actionsCount,
                        size, side, asteroids, unitsArray, projectileService);
                });
            });
        });
    }
}
