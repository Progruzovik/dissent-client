import axios from "axios";

const FIELD_PREFIX = "/api/field";

export function postScenario(callback: () => void) {
    axios.post("/api/battle/scenario").then(callback);
}

export function getField(callback: (ships: Ship[], guns: Gun[], size: Point,
                                    side: Side, asteroids: Point[], units: Unit[]) => void) {
    axios.all([
        axios.get(FIELD_PREFIX + "/ships"),
        axios.get(FIELD_PREFIX + "/guns"),
        axios.get(FIELD_PREFIX + "/size"),
        axios.get(FIELD_PREFIX + "/side"),
        axios.get(FIELD_PREFIX + "/asteroids"),
        axios.get(FIELD_PREFIX + "/units")
    ]).then(axios.spread((ships, guns, size, side, asteroids, units) =>
        callback(ships.data, guns.data, size.data, side.data, asteroids.data, units.data)));
}

export function getPaths(callback: (paths: Point[][]) => void) {
    axios.get(FIELD_PREFIX + "/paths").then((response) => callback(response.data));
}

export function postCurrentUnitCell(data: Point, callback: () => void) {
    axios.post(FIELD_PREFIX + "/unit/cell", data).then(callback);
}

export function postTurn(callback: () => void) {
    axios.post(FIELD_PREFIX + "/turn").then(callback);
}

export const enum Side {
    None, Left, Right
}

export class Gun {
    constructor(readonly id: number, readonly name: string, readonly radius: number, readonly cooldown: number,
                readonly projectileType: string, readonly shotsCount: number, readonly shotDelay: number) {}
}

export class Point {
    constructor(readonly x: number, readonly y: number) {}
}

class Ship {
    constructor(readonly id: number, readonly name: string, readonly speed: number) {}
}

class Unit {
    constructor(readonly sideValue: Side, readonly cell: Point, readonly shipId: number,
                readonly firstGunId: number, readonly secondGunId: number) {}
}
