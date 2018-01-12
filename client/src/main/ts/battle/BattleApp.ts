import WebSocketClient from "./WebSocketClient";
import BattlefieldRoot from "./battlefield/BattlefieldRoot";
import ProjectileService from "./battlefield/projectile/ProjectileService";
import Unit from "./battlefield/unit/Unit";
import Menu from "./menu/main/MainMenu";
import MenuRoot from "./menu/MenuRoot";
import Ship from "./ship/Ship";
import { updateLocalizedData } from "../localizer";
import { initClient } from "./request";
import * as game from "../game";
import * as PIXI from "pixi.js";

export default class BattleApp extends game.App {

    private menuRoot: MenuRoot;
    private readonly projectileService = new ProjectileService();
    private readonly webSocketClient = new WebSocketClient();

    constructor(resolution: number, width: number, height: number) {
        super(resolution, width, height);
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
                    this.menuRoot = new MenuRoot(this.webSocketClient);
                    this.root = this.menuRoot;
                    this.menuRoot.on(Menu.BATTLE, () => this.startBattle());
                });
            });
        });
    }

    private startBattle() {
        this.webSocketClient.requestBattleData(d => {
            const unitsArray = new Array<Unit>(0);
            for (const unitData of d.units) {
                unitsArray.push(new Unit(unitData.actionPoints, d.playerSide, unitData.side,
                    unitData.firstCell, new Ship(unitData.ship), this.projectileService));
            }
            for (const unitData of d.destroyedUnits) {
                const unit = new Unit(unitData.actionPoints, d.playerSide,
                    unitData.side, unitData.firstCell, new Ship(unitData.ship));
                unit.strength = 0;
                unitsArray.push(unit);
            }

            this.root = new BattlefieldRoot(d.fieldSize, d.playerSide,
                unitsArray, d.asteroids, d.clouds, this.projectileService, this.webSocketClient);
            this.root.once(game.Event.DONE, () => {
                this.menuRoot.reload();
                this.root.destroy({ children: true });
                this.root = this.menuRoot;
            });
        });
    }
}
