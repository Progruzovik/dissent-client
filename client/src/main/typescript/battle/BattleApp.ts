import WebSocketConnection from "./WebSocketConnection";
import BattlefieldScreen from "./battlefield/BattlefieldScreen";
import ProjectileService from "./battlefield/projectile/ProjectileService";
import Unit from "./battlefield/unit/Unit";
import MenuScreen from "./menu/MenuScreen";
import { getBattle, getId, Side } from "./request";
import * as game from "../game";
import * as PIXI from "pixi.js";

export default class BattleApp extends game.Application {

    constructor() {
        super();
        getId(() => {
            const webSocketConnection = new WebSocketConnection();
            webSocketConnection.requestTextures(textures => {
                for (const texture of textures) {
                    PIXI.loader.add(texture.name, "img/" + texture.name + ".png", (resource: PIXI.loaders.Resource) =>
                        resource.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST);
                }
                PIXI.loader.load(() => {
                    const menuScreen = new MenuScreen(webSocketConnection);
                    this.currentScreen = menuScreen;
                    menuScreen.on(MenuScreen.BATTLE, () => {
                        getBattle((hulls, guns, size, side, asteroids, clouds, destroyedUnits, units) => {
                            const projectileService = new ProjectileService();
                            const destroyedUnitSprites = new Array<PIXI.Sprite>(0);
                            for (const unit of destroyedUnits) {
                                const sprite = new PIXI.Sprite(PIXI.loader.resources[hulls.filter(h =>
                                    h.id == unit.ship.hullId)[0].texture.name].texture);
                                sprite.alpha = Unit.ALPHA_DESTROYED;
                                if (unit.side == Side.Right) {
                                    sprite.scale.x = -1;
                                    sprite.anchor.x = 1;
                                }
                                sprite.x = unit.cell.x * Unit.WIDTH;
                                sprite.y = unit.cell.y * Unit.HEIGHT;
                                destroyedUnitSprites.push(sprite);
                            }
                            const unitsArray = new Array<Unit>(0);
                            for (const unit of units) {
                                unitsArray.push(new Unit(unit.side, unit.cell,
                                    hulls.filter(h => h.id == unit.ship.hullId)[0],
                                    guns.filter(g => g.id == unit.ship.firstGunId)[0],
                                    guns.filter(g => g.id == unit.ship.secondGunId)[0], projectileService));
                            }
                            this.currentScreen = new BattlefieldScreen(size, side, asteroids, clouds,
                                destroyedUnitSprites, unitsArray, projectileService, webSocketConnection);
                            this.currentScreen.once(game.Event.DONE, () => this.currentScreen = menuScreen);
                        });
                    });
                });
            });
        });
    }
}
