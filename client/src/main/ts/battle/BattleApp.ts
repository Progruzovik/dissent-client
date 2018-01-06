import WebSocketClient from "./WebSocketClient";
import BattlefieldScreen from "./battlefield/BattlefieldScreen";
import ProjectileService from "./battlefield/projectile/ProjectileService";
import Unit from "./battlefield/unit/Unit";
import Menu from "./menu/main/MainMenu";
import MenuScreen from "./menu/MenuScreen";
import Ship from "./ship/Ship";
import { updateLocalizedData } from "../localizer";
import { initClient } from "./request";
import * as game from "../game";
import * as PIXI from "pixi.js";

export default class BattleApp extends game.Application {

    private menuScreen: MenuScreen;
    private readonly projectileService = new ProjectileService();
    private readonly webSocketClient = new WebSocketClient();

    constructor() {
        super();
        initClient("ru", s => {
            updateLocalizedData(s);
            const webSocketUrl: string = document.baseURI.toString()
                .replace("http", "ws") + "/app";
            this.webSocketClient.createConnection(webSocketUrl);
            this.webSocketClient.requestTextures(textures => {
                for (const texture of textures) {
                    PIXI.loader.add(texture.name, `img/${texture.name}.png`);
                }
                PIXI.loader.load(() => {
                    this.menuScreen = new MenuScreen(this.webSocketClient);
                    this.currentScreen = this.menuScreen;
                    this.menuScreen.on(Menu.BATTLE, () => this.startBattle());
                });
            });
        });
    }

    startBattle() {
        this.webSocketClient.requestBattleData(d => {
            const unitsArray = new Array<Unit>(0);
            for (const unitData of d.units) {
                unitsArray.push(new Unit(unitData.actionPoints, d.playerSide, unitData.side,
                    unitData.cell, new Ship(unitData.ship), this.projectileService));
            }
            for (const unitData of d.destroyedUnits) {
                const unit = new Unit(unitData.actionPoints, d.playerSide,
                    unitData.side, unitData.cell, new Ship(unitData.ship));
                unit.strength = 0;
                unitsArray.push(unit);
            }

            const battlefield = new BattlefieldScreen(d.fieldSize, d.playerSide,
                unitsArray, d.asteroids, d.clouds, this.projectileService, this.webSocketClient);
            this.currentScreen = battlefield;
            battlefield.once(game.Event.DONE, () => {
                this.menuScreen.reload();
                this.currentScreen = this.menuScreen;
            });
        });
    }
}
