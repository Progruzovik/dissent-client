export const enum ActionType {
    Move = "move",
    Shot = "shot",
    NextTurn = "nextTurn",
    BattleFinish = "battleFinish"
}

export enum Status {
    Idle, Queued, InBattle
}

export class Cell {
    constructor(readonly x: number, readonly y: number) {}
}

export class Shot {
    constructor(readonly gunId: number, readonly cell: Cell) {}
}

export class Texture {
    constructor(readonly id: number, readonly name: string) {}
}
