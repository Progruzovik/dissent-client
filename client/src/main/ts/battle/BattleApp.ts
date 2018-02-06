import WebSocketClient from "../WebSocketClient";
import BattlefieldRoot from "./battlefield/BattlefieldRoot";
import ProjectileService from "./battlefield/projectile/ProjectileService";
import Unit from "./battlefield/unit/Unit";
import Menu from "./menu/hangar/Hangar";
import MenuRoot from "./menu/MenuRoot";
import Ship from "../ship/Ship";
import * as druid from "pixi-druid";
import * as PIXI from "pixi.js";

export default class BattleApp extends druid.App {

    private menuRoot: MenuRoot;
    private readonly projectileService = new ProjectileService();

    constructor(resolution: number, width: number, height: number, private readonly webSocketClient: WebSocketClient) {
        super(resolution, width, height);
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

            this.root = new BattlefieldRoot(d.fieldSize, d.playerSide, d.log,
                unitsArray, d.asteroids, d.clouds, this.projectileService, this.webSocketClient);
            this.root.once(druid.Event.DONE, () => {
                this.menuRoot.updateInfo();
                this.root.destroy({ children: true });
                this.root = this.menuRoot;
            });
        });
    }
}
