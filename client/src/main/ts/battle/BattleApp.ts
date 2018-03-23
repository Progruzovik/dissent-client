import WebSocketClient from "../WebSocketClient";
import { BattlefieldRoot } from "./battlefield/BattlefieldRoot";
import ProjectileService from "./battlefield/projectile/ProjectileService";
import Unit from "./battlefield/unit/Unit";
import Ship from "../model/Ship";
import * as druid from "pixi-druid";
import * as PIXI from "pixi.js";

export class BattleApp extends druid.App {

    private readonly projectileService = new ProjectileService();

    constructor(resolution: number, width: number, height: number, canvas: HTMLCanvasElement,
                private readonly webSocketClient: WebSocketClient) {
        super(resolution, width, height, canvas);
        this.webSocketClient.requestTextures(textures => {
            for (const texture of textures) {
                PIXI.loader.add(texture.name, `/img/${texture.name}.png`);
            }
            PIXI.loader.load(() => {
                this.webSocketClient.requestBattleData(d => {
                    const unitsArray: Unit[] = [];
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
                    this.root.once(druid.Event.DONE, () => this.emit(druid.Event.DONE));
                });
            });
        });
    }
}
