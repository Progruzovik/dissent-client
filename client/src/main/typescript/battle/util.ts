export enum ActionType {
    Move, Shot, NextTurn, Finish
}

export enum Status {
    Idle, Queued, InBattle
}

export class Action {
    constructor(readonly number: number, readonly type: ActionType) {}
}
