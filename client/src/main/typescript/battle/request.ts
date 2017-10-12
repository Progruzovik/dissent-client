import axios from "axios";

const PLAYER_PREFIX = "/api/player";
const BATTLE_PREFIX = "/api/battle";

export function getTextures(callback: (textures: Texture[]) => void) {
    axios.get("/api/textures").then(response => callback(response.data));
}

export function postQueue(callback: () => void) {
    axios.post(PLAYER_PREFIX + "/queue").then(callback);
}

export function deleteQueue(callback: () => void) {
    axios.delete(PLAYER_PREFIX + "/queue").then(callback);
}

export function postScenario(callback: () => void) {
    axios.post(PLAYER_PREFIX + "/scenario").then(callback);
}

export function getField(callback: (actionsCount: number, ships: Hull[], guns: Gun[], size: Cell,
                                    side: Side, asteroids: Cell[], units: Unit[]) => void) {
    axios.all([
        axios.get(BATTLE_PREFIX + "/actions/count"),
        axios.get(BATTLE_PREFIX + "/ships"),
        axios.get(BATTLE_PREFIX + "/guns"),
        axios.get(BATTLE_PREFIX + "/size"),
        axios.get(BATTLE_PREFIX + "/side"),
        axios.get(BATTLE_PREFIX + "/asteroids"),
        axios.get(BATTLE_PREFIX + "/units"),
    ]).then(axios.spread((actionsCount, ships, guns, size, side, asteroids, units) =>
        callback(actionsCount.data, ships.data, guns.data, size.data, side.data, asteroids.data, units.data)));
}

export function getAction(number: number, onSuccess: (action: Action) => void, onError: () => void) {
    axios.get(BATTLE_PREFIX + "/action/" + number)
        .then(response => onSuccess(response.data))
        .catch(onError);
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

export const enum ActionType {
    Move, Shot, NextTurn, Finish
}

export const enum Side {
    None, Left, Right
}

export const enum Status {
    Idle, Queued, InBattle
}

export class Action {
    constructor(readonly number: number, readonly type: ActionType) {}
}

export class Cell {
    constructor(readonly x: number, readonly y: number) {}
}

export class Gun {
    constructor(readonly id: number, readonly name: string, readonly cooldown: number,
                readonly projectileType: string, readonly shotsCount: number, readonly shotDelay: number) {}
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
