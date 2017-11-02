import WebSocketConnection from "./WebSocketConnection";
import BattlefieldScreen from "./battlefield/BattlefieldScreen";
import ProjectileService from "./battlefield/projectile/ProjectileService";
import Unit from "./battlefield/unit/Unit";
import MenuScreen from "./menu/MenuScreen";
import { getId } from "./request";
import { Side } from "./util";
import * as game from "../game";
import * as PIXI from "pixi.js";

export default class BattleApp extends game.Application {

    constructor() {
        super();
        getId(() => {
            const webSocketConnection = new WebSocketConnection();
            webSocketConnection.requestTextures(textures => {
                for (const texture of textures) {
                    PIXI.loader.add(texture.name, `img/${texture.name}.png`, (resource: PIXI.loaders.Resource) =>
                        resource.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST);
                }
                PIXI.loader.load(() => {
                    const menuScreen = new MenuScreen(webSocketConnection);
                    this.currentScreen = menuScreen;
                    menuScreen.on(MenuScreen.BATTLE, () => {
                        webSocketConnection.requestBattleData(d => {
                            const projectileService = new ProjectileService();
                            const destroyedUnitSprites = new Array<PIXI.Sprite>(0);
                            for (const unit of d.destroyedUnits) {
                                const sprite = new PIXI.Sprite(PIXI.loader.resources[d.hulls.filter(h =>
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
                            for (const unit of d.units) {
                                unitsArray.push(new Unit(unit.actionPoints, unit.ship.strength, unit.side, unit.cell,
                                    d.hulls.filter(h => h.id == unit.ship.hullId)[0],
                                    d.guns.filter(g => g.id == unit.ship.firstGunId)[0],
                                    d.guns.filter(g =>
                                        g.id == unit.ship.secondGunId)[0], projectileService));
                            }
                            this.currentScreen = new BattlefieldScreen(d.fieldSize, d.side, d.asteroids,
                                d.clouds, destroyedUnitSprites, unitsArray, projectileService, webSocketConnection);
                            this.currentScreen.once(game.Event.DONE, () => this.currentScreen = menuScreen);
                        });
                    });
                });
            });
        });
    }
}
