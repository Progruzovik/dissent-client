import WebSocketClient from "./WebSocketClient";
import BattlefieldScreen from "./battlefield/BattlefieldScreen";
import ProjectileService from "./battlefield/projectile/ProjectileService";
import Unit from "./battlefield/unit/Unit";
import MenuScreen from "./menu/MenuScreen";
import { getId } from "./request";
import * as game from "../game";
import * as PIXI from "pixi.js";

export default class BattleApp extends game.Application {

    private readonly projectileService = new ProjectileService();

    constructor() {
        super();
        getId(() => {
            const webSocketClient = new WebSocketClient();
            webSocketClient.requestTextures(textures => {
                for (const texture of textures) {
                    PIXI.loader.add(texture.name, `img/${texture.name}.png`);
                }
                PIXI.loader.load(() => {
                    const menuScreen = new MenuScreen(webSocketClient);
                    this.currentScreen = menuScreen;

                    menuScreen.on(MenuScreen.BATTLE, () => {
                        webSocketClient.requestBattleData(d => {
                            const unitsArray = new Array<Unit>(0);
                            for (const unitData of d.units) {
                                unitsArray.push(new Unit(unitData.actionPoints,
                                    unitData.ship.strength, d.playerSide, unitData.side, unitData.cell,
                                    d.hulls.filter(h => h.id == unitData.ship.hullId)[0],
                                    d.guns.filter(g => g.id == unitData.ship.firstGunId)[0],
                                    d.guns.filter(g => g.id == unitData.ship.secondGunId)[0],
                                    this.projectileService));
                            }
                            for (const unitData of d.destroyedUnits) {
                                const unit = new Unit(unitData.actionPoints,
                                    unitData.ship.strength, d.playerSide, unitData.side, unitData.cell,
                                    d.hulls.filter(h => h.id == unitData.ship.hullId)[0],
                                    d.guns.filter(g => g.id == unitData.ship.firstGunId)[0],
                                    d.guns.filter(g => g.id == unitData.ship.secondGunId)[0]);
                                unit.strength = 0;
                                unitsArray.push(unit);
                            }
                            this.currentScreen = new BattlefieldScreen(d.fieldSize, d.playerSide,
                                unitsArray, d.asteroids, d.clouds, this.projectileService, webSocketClient);
                            this.currentScreen.once(game.Event.DONE, () => {
                                webSocketClient.updateStatus();
                                this.currentScreen = menuScreen
                            });
                        });
                    });
                });
            });
        });
    }
}
