import axios from "axios";

const PLAYER_PREFIX = "/api/player";
const BATTLE_PREFIX = "/api/battle";

export function getTextures(callback: (textures: Texture[]) => void) {
    axios.get("/api/textures").then(response => callback(response.data));
}

export function getId(callback: (id: string) => void) {
    axios.get(PLAYER_PREFIX + "/id").then(response => callback(response.data));
}

export function getField(callback: (actionsCount: number, ships: Hull[], guns: Gun[], size: Cell,
                                    side: Side, asteroids: Cell[], clouds: Cell[], units: Unit[]) => void) {
    axios.all([
        axios.get(BATTLE_PREFIX + "/actions/count"),
        axios.get(BATTLE_PREFIX + "/hulls"),
        axios.get(BATTLE_PREFIX + "/guns"),
        axios.get(BATTLE_PREFIX + "/size"),
        axios.get(BATTLE_PREFIX + "/side"),
        axios.get(BATTLE_PREFIX + "/asteroids"),
        axios.get(BATTLE_PREFIX + "/clouds"),
        axios.get(BATTLE_PREFIX + "/units"),
    ]).then(axios.spread((actionsCount, ships, guns, size, side, asteroids, clouds, units) =>
        callback(actionsCount.data, ships.data, guns.data, size.data,
            side.data, asteroids.data, clouds.data, units.data)));
}

export function getMove(number: number, callback: (move: Cell[]) => void) {
    axios.get(BATTLE_PREFIX + "/move/" + number).then(response => callback(response.data));
}

export function getShot(number: number, callback: (shot: Shot) => void) {
    axios.get(BATTLE_PREFIX + "/shot/" + number).then(response => callback(response.data));
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

export function postTurn() {
    axios.post(BATTLE_PREFIX + "/turn");
}

export const enum Side {
    None, Left, Right
}

export class Cell {
    constructor(readonly x: number, readonly y: number) {}
}

export class Gun {
    constructor(readonly id: number, readonly name: string, readonly cooldown: number,
                readonly shotsCount: number, readonly shotDelay: number, readonly gunTypeName: string) {}
}

export class Hull {
    constructor(readonly id: number, readonly speed: number, readonly texture: Texture) {}
}

class Shot {
    constructor(readonly gunId: number, readonly cell: Cell) {}
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
