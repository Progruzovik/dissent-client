import { WebSocketClient } from "../WebSocketClient";
import { BattlefieldRoot } from "./battlefield/BattlefieldRoot";
import { ProjectileService } from "./battlefield/projectile/ProjectileService";
import { Unit } from "./battlefield/unit/Unit";
import { Ship } from "../model/Ship";
import * as druid from "pixi-druid";
import * as PIXI from "pixi.js";

export class BattleApp extends druid.App {

    private readonly projectileService = new ProjectileService();

    constructor(resolution: number, width: number, height: number, canvas: HTMLCanvasElement,
                private readonly webSocketClient: WebSocketClient) {
        super(resolution, width, height, canvas);
        Promise.all([
            this.webSocketClient.requestTextures(),
            this.webSocketClient.requestBattleData()
        ]).then(data => {
            for (const texture of data[0]) {
                PIXI.loader.add(texture.name, `/img/${texture.name}.png`);
            }
            PIXI.loader.load(() => {
                const unitsArray: Unit[] = [];
                for (const unitData of data[1].units) {
                    unitsArray.push(new Unit(unitData.actionPoints, data[1].playerSide, unitData.side,
                        unitData.firstCell, new Ship(unitData.ship), this.projectileService));
                }
                for (const unitData of data[1].destroyedUnits) {
                    const unit = new Unit(unitData.actionPoints, data[1].playerSide,
                        unitData.side, unitData.firstCell, new Ship(unitData.ship));
                    unit.strength = 0;
                    unitsArray.push(unit);
                }
                this.root = new BattlefieldRoot(data[1].fieldSize, data[1].playerSide, data[1].log,
                    unitsArray, data[1].asteroids, data[1].clouds, this.projectileService, this.webSocketClient);
                this.root.once(druid.Event.DONE, () => this.emit(druid.Event.DONE));
            });
        });
    }
}
