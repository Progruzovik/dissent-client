import axios from "axios";

export function postScenario(callback: () => void) {
    axios.post("/api/battle/scenario").then(callback);
}

export function getField(callback: (ships: Ship[], guns: Gun[], size: Point, side: Side, units: Unit[]) => void) {
    axios.all([
        axios.get("/api/field/ships"),
        axios.get("/api/field/guns"),
        axios.get("/api/field/size"),
        axios.get("/api/field/side"),
        axios.get("/api/field/units")
    ]).then(axios.spread((ships, guns, size, side, queue) =>
        callback(ships.data, guns.data, size.data, side.data, queue.data)));
}

export function postCurrentUnitCell(data: Point, callback: () => void) {
    axios.post("/api/field/unit/cell", data).then(callback);
}

export function postTurn(callback: () => void) {
    axios.post("/api/field/turn").then(callback);
}

export const enum Side {
    None, Left, Right
}

export class Gun {
    constructor(readonly id: number, readonly name: string, readonly radius: number, readonly cooldown: number,
                readonly projectileType: string, readonly shotsCount: number, readonly shotDelay: number) {}
}

class Ship {
    constructor(readonly id: number, readonly name: string, readonly speed: number) {}
}

class Unit {
    constructor(readonly sideValue: Side, readonly cell: Point, readonly shipId: number,
                readonly firstGunId: number, readonly secondGunId: number) {}
}

class Point {
    constructor(readonly x: number, readonly y: number) {}
}
