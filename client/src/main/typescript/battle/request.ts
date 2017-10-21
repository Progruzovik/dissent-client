import { Cell } from "./util";
import axios from "axios";

const BATTLE_PREFIX = "/api/battle";

export function getTextures(callback: (textures: Texture[]) => void) {
    axios.get("/api/textures").then(response => callback(response.data));
}

export function getId(callback: (id: string) => void) {
    axios.get("/api/player/id").then(response => callback(response.data));
}

export function getField(callback: (ships: Hull[], guns: Gun[], size: Cell, side: Side, asteroids: Cell[],
                                    clouds: Cell[], destroyedUnits: Unit[], units: Unit[]) => void) {
    axios.all([
        axios.get(BATTLE_PREFIX + "/hulls"),
        axios.get(BATTLE_PREFIX + "/guns"),
        axios.get(BATTLE_PREFIX + "/size"),
        axios.get(BATTLE_PREFIX + "/side"),
        axios.get(BATTLE_PREFIX + "/asteroids"),
        axios.get(BATTLE_PREFIX + "/clouds"),
        axios.get(BATTLE_PREFIX + "/units/destroyed"),
        axios.get(BATTLE_PREFIX + "/units"),
    ]).then(axios.spread((ships, guns, size, side, asteroids, clouds, destroyedUnits, units) =>
        callback(ships.data, guns.data, size.data, side.data,
            asteroids.data, clouds.data, destroyedUnits.data, units.data)));
}

export function getCurrentPaths(callback: (paths: Cell[][]) => void) {
    axios.get(BATTLE_PREFIX + "/unit/paths").then(response => callback(response.data));
}

export function getCurrentReachableCells(callback: (reachableCells: Cell[]) => void) {
    axios.get(BATTLE_PREFIX + "/unit/cells").then(response => callback(response.data));
}

export function postCurrentUnitCell(cell: Cell) {
    axios.post(BATTLE_PREFIX + "/unit/cell", cell);
}

export function getCellsForCurrentUnitShot(gunId: number, callback: (shotCells: Cell[], targetCells: Cell[]) => void) {
    axios.get(BATTLE_PREFIX + "/unit/shot", { params: { gunId: gunId } })
        .then(response => callback(response.data.shotCells, response.data.targetCells));
}

export function postCurrentUnitShot(gunId: number, cell: Cell) {
    axios.post(BATTLE_PREFIX + "/unit/shot", cell, { params: { gunId: gunId } });
}

export const enum Side {
    None, Left, Right
}

export class Gun {
    constructor(readonly id: number, readonly name: string, readonly cooldown: number, readonly gunTypeName: string) {}
}

export class Hull {
    constructor(readonly id: number, readonly speed: number, readonly texture: Texture) {}
}

class Texture {
    constructor(readonly id: number, readonly name: string) {}
}

class Unit {
    constructor(readonly side: Side, readonly cell: Cell, readonly ship: Ship) {}
}

class Ship {
    constructor(readonly hullId: number, readonly firstGunId: number, readonly secondGunId: number) {}
}
