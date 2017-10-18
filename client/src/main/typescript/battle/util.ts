export enum ActionType {
    Move, Shot, NextTurn, Finish
}

export enum Subject {
    Status, Action
}

export class Action {
    constructor(readonly number: number, readonly type: ActionType) {}
}
