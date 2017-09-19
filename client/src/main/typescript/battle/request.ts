import axios from "axios";

const BATTLE_PREFIX = "/api/battle";

export function postScenario(callback: () => void) {
    axios.post("/api/scenario").then(callback);
}

export function getField(callback: (ships: Ship[], guns: Gun[], size: Cell,
                                    side: Side, asteroids: Cell[], units: Unit[]) => void) {
    axios.all([
        axios.get(BATTLE_PREFIX + "/ships"),
        axios.get(BATTLE_PREFIX + "/guns"),
        axios.get(BATTLE_PREFIX + "/size"),
        axios.get(BATTLE_PREFIX + "/side"),
        axios.get(BATTLE_PREFIX + "/asteroids"),
        axios.get(BATTLE_PREFIX + "/units")
    ]).then(axios.spread((ships, guns, size, side, asteroids, units) =>
        callback(ships.data, guns.data, size.data, side.data, asteroids.data, units.data)));
}

export function getCurrentPaths(callback: (paths: Cell[][]) => void) {
    axios.get(BATTLE_PREFIX + "/unit/paths").then(response => callback(response.data));
}

export function getCurrentReachableCells(callback: (reachableCells: Cell[]) => void) {
    axios.get(BATTLE_PREFIX + "/unit/cells").then(response => callback(response.data));
}

export function postCurrentUnitCell(data: Cell, callback: () => void) {
    axios.post(BATTLE_PREFIX + "/unit/cell", data).then(callback);
}

export function getCurrentShotCells(gunNumber: number, callback: (gunCells: Cell[]) => void) {
    axios.get(BATTLE_PREFIX + "/unit/shot", { params: { gunNumber: gunNumber } })
        .then(response => callback(response.data));
}

export function postTurn(callback: () => void) {
    axios.post(BATTLE_PREFIX + "/turn").then(callback);
}

export const enum Side {
    None, Left, Right
}

export class Gun {
    constructor(readonly id: number, readonly name: string, readonly radius: number, readonly cooldown: number,
                readonly projectileType: string, readonly shotsCount: number, readonly shotDelay: number) {}
}

export class Cell {
    constructor(readonly x: number, readonly y: number) {}
}

class Ship {
    constructor(readonly id: number, readonly name: string, readonly speed: number) {}
}

class Unit {
    constructor(readonly side: Side, readonly cell: Cell, readonly shipId: number,
                readonly firstGunId: number, readonly secondGunId: number) {}
}
