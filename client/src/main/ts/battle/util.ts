import * as game from "../game";

export const enum ActionType {
    Move = "move",
    Shot = "shot",
    NextTurn = "nextTurn",
    BattleFinish = "battleFinish"
}

export const enum GunType {
    Artillery = "artillery",
    Beam = "beam",
    Shell = "shell"
}

export enum Status {
    Idle, Queued, InBattle
}

export const enum Side {
    None, Left, Right
}

export class Gun {
    constructor(readonly id: number, readonly name: string,
                readonly shotCost: number, readonly typeName: GunType) {}
}

export class Hull {
    constructor(readonly id: number, readonly name: string, readonly actionPoints: number,
                readonly strength: number, readonly texture: Texture) {}
}

export class Ship {
    constructor(readonly strength: number, readonly hull: Hull, readonly firstGun: Gun, readonly secondGun: Gun) {}
}

export class Move {
    constructor(readonly cost: number, readonly cells: game.Point[]) {}
}

export class PathNode {
    constructor(readonly movementCost: number, readonly cell: game.Point) {}
}

export class Shot {
    constructor(readonly gunId: number, readonly damage: number, readonly cell: game.Point) {}
}

export class Texture {
    constructor(readonly id: number, readonly name: string) {}
}
