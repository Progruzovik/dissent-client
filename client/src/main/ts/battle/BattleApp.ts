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
                    PIXI.loader.add(texture.name, `img/${texture.name}.png`);
                }
                PIXI.loader.load(() => {
                    const menuScreen = new MenuScreen(webSocketConnection);
                    this.currentScreen = menuScreen;
                    menuScreen.on(MenuScreen.BATTLE, () => {
                        webSocketConnection.requestBattleData(d => {
                            const projectileService = new ProjectileService();
                            const unitsArray = new Array<Unit>(0);
                            for (const unitData of d.units) {
                                unitsArray.push(new Unit(d.playerSide, unitData.actionPoints,
                                    unitData.ship.strength, unitData.side, unitData.cell,
                                    d.hulls.filter(h => h.id == unitData.ship.hullId)[0],
                                    d.guns.filter(g => g.id == unitData.ship.firstGunId)[0],
                                    d.guns.filter(g => g.id == unitData.ship.secondGunId)[0],
                                    projectileService));
                            }
                            for (const unitData of d.destroyedUnits) {
                                const unit = new Unit(d.playerSide, unitData.actionPoints,
                                    unitData.ship.strength, unitData.side, unitData.cell,
                                    d.hulls.filter(h => h.id == unitData.ship.hullId)[0],
                                    d.guns.filter(g => g.id == unitData.ship.firstGunId)[0],
                                    d.guns.filter(g => g.id == unitData.ship.secondGunId)[0]);
                                unit.strength = 0;
                                unitsArray.push(unit);
                            }
                            this.currentScreen = new BattlefieldScreen(d.fieldSize, d.playerSide,
                                unitsArray, d.asteroids, d.clouds, projectileService, webSocketConnection);
                            this.currentScreen.once(game.Event.DONE, () => {
                                webSocketConnection.requestStatus();
                                this.currentScreen = menuScreen
                            });
                        });
                    });
                });
            });
        });
    }
}
