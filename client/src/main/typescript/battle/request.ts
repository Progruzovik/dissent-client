import Gun from "./gun/Gun";
import { Side } from  "./utils";
import axios from "axios";

export function getField(callback: (ships: Ship[], size: Point, side: Side, units: Unit[]) => void) {
    axios.all([
        axios.get("/api/field/ships"),
        axios.get("/api/field/size"),
        axios.get("/api/field/side"),
        axios.get("/api/field/units")
    ]).then(axios.spread((ships, size, side, queue) =>
        callback(ships.data, size.data, side.data, queue.data)));
}

class Ship {
    constructor(readonly id: number, readonly name: string, readonly speed: number) {}
}

class Unit {
    constructor(readonly sideValue: number, readonly cell: Point, readonly shipId: number,
                readonly firstGun: Gun, readonly secondGun: Gun) {}
}

class Point {
    constructor(readonly x: number, readonly y: number) {}
}
