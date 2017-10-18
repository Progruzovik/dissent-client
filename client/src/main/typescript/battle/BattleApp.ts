import WebSocketConnection from "./WebSocketConnection";
import BattlefieldScreen from "./battlefield/BattlefieldScreen";
import ProjectileService from "./battlefield/projectile/ProjectileService";
import Unit from "./battlefield/unit/Unit";
import MenuScreen from "./menu/MenuScreen";
import { getField, getTextures } from "./request";
import * as game from "../game";
import * as PIXI from "pixi.js";

export default class BattleApp extends game.Application {

    constructor() {
        super();
        const webSocketConnection = new WebSocketConnection();
        const menuScreen = new MenuScreen(webSocketConnection);
        getTextures(textures => {
            for (const texture of textures) {
                PIXI.loader.add(texture.name, "img/" + texture.name + ".png", (resource: PIXI.loaders.Resource) =>
                    resource.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST);
            }
            PIXI.loader.load(() => this.currentScreen = menuScreen);
        });

        menuScreen.on(MenuScreen.BATTLE, () => {
            getField((actionsCount, hulls, guns, size, side, asteroids, units) => {
                const projectileService = new ProjectileService();
                const unitsArray = new Array<Unit>(0);
                for (const unit of units) {
                    unitsArray.push(new Unit(unit.side, unit.cell,
                        hulls.filter(hull => hull.id == unit.ship.hullId)[0],
                        guns.filter(gun => gun.id == unit.ship.firstGunId)[0],
                        guns.filter(gun => gun.id == unit.ship.secondGunId)[0], projectileService));
                }
                this.currentScreen = new BattlefieldScreen(actionsCount, size, side,
                    asteroids, unitsArray, webSocketConnection, projectileService);
                this.currentScreen.once(game.Event.DONE, () => this.currentScreen = menuScreen);
            });
        });
    }
}
