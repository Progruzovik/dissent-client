import axios from "axios";

const BATTLE_PREFIX = "/api/battle";

export function postScenario(callback: () => void) {
    axios.post("/api/scenario").then(callback);
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

export function getActions(fromIndex: number, callback: (actions: Action[]) => void) {
    axios.get(BATTLE_PREFIX + "/actions", { params: { fromIndex: fromIndex } })
        .then(response => callback(response.data));
}

export function getActionsCount(callback: (actionsCount: number) => void) {
    axios.get(BATTLE_PREFIX + "/actions/count").then(response => callback(response.data));
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

export function postCurrentUnitShot(cell: Cell) {
    axios.post(BATTLE_PREFIX + "/unit/shot", cell);
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

class Hull {
    constructor(readonly id: number, readonly name: string, readonly speed: number) {}
}

class Shot {
    constructor(readonly gunId: number, readonly cell: Cell) {}
}

class Unit {
    constructor(readonly side: Side, readonly cell: Cell, readonly hullId: number,
                readonly firstGunId: number, readonly secondGunId: number) {}
}
